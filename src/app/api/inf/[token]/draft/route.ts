import { NextResponse, NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 })
  }

  try {
    const supabase = createServiceClient()

    // 1. access_token으로 campaign_influencers 조회
    const { data: ci, error: fetchError } = await supabase
      .from('campaign_influencers')
      .select('id, campaign_id, influencer_id, influencers(name)')
      .eq('access_token', token)
      .single()

    if (fetchError || !ci) {
      return NextResponse.json({ error: 'Influencer token not found' }, { status: 404 })
    }

    let caption = ''
    let hashtags = ''
    let note = ''
    let fileUrls: string[] = []

    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      caption = (formData.get('caption') as string) || ''
      hashtags = (formData.get('hashtags') as string) || ''
      note = (formData.get('note') as string) || ''

      const files = formData.getAll('file') as File[]
      for (const file of files) {
        if (file && typeof file === 'object' && file.name) {
          const timestamp = Date.now()
          const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
          const storagePath = `${ci.campaign_id}/${ci.influencer_id}/${timestamp}_${sanitizedFilename}`

          const buffer = Buffer.from(await file.arrayBuffer())
          const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('drafts')
            .upload(storagePath, buffer, {
              contentType: file.type || 'application/octet-stream',
              upsert: true
            })

          if (!uploadError && uploadData) {
            const { data: publicUrlData } = supabase
              .storage
              .from('drafts')
              .getPublicUrl(storagePath)

            fileUrls.push(publicUrlData.publicUrl)
          } else {
            console.warn('Storage upload warning:', uploadError)
            fileUrls.push(`/mock/drafts/${sanitizedFilename}`)
          }
        }
      }
    } else {
      const body = await request.json()
      caption = body.caption || ''
      hashtags = body.hashtags || ''
      note = body.note || ''
      if (body.file_url) fileUrls.push(body.file_url)
      if (Array.isArray(body.file_urls)) fileUrls.push(...body.file_urls)
    }

    // 2. 기존 drafts에서 같은 campaign_influencer_id의 최대 version 조회 후 +1
    const { data: existingDrafts } = await supabase
      .from('drafts')
      .select('version')
      .eq('campaign_influencer_id', ci.id)
      .order('version', { ascending: false })
      .limit(1)

    const maxVersion = existingDrafts && existingDrafts.length > 0 ? existingDrafts[0].version : 0
    const newVersion = maxVersion + 1

    // 3. drafts INSERT (status: 'submitted')
    const { data: newDraft, error: insertError } = await supabase
      .from('drafts')
      .insert({
        campaign_influencer_id: ci.id,
        version: newVersion,
        caption: caption || null,
        hashtags: hashtags || null,
        note: note || null,
        file_urls: fileUrls,
        status: 'submitted',
        submitted_at: new Date().toISOString()
      })
      .select()
      .single()

    if (insertError || !newDraft) {
      return NextResponse.json({ error: insertError?.message || 'Failed to submit draft' }, { status: 500 })
    }

    const infName = typeof ci.influencers === 'object' && ci.influencers !== null ? (ci.influencers as any).name : '인플루언서'

    // 4. activity_logs INSERT (type: 'draft_submitted')
    await supabase.from('activity_logs').insert({
      campaign_id: ci.campaign_id,
      type: 'draft_submitted',
      actor_type: 'influencer',
      actor_name: infName,
      description: `${infName} 님이 원고 v${newVersion}을(를) 제출했습니다.`,
      metadata: { draft_id: newDraft.id, version: newVersion }
    })

    return NextResponse.json({
      success: true,
      message: '원고가 제출되었습니다.',
      draft: newDraft,
      token,
    })
  } catch (error: any) {
    console.error('Error submitting draft:', error)
    return NextResponse.json({ error: error.message || 'Failed to submit draft' }, { status: 500 })
  }
}
