import { NextResponse, NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string; ci_id: string }> }
) {
  try {
    const { id: campaignId, ci_id: ciId } = await context.params
    const supabase = createServiceClient()

    // 1. 기존 레코드 확인
    const { data: ci, error: fetchError } = await supabase
      .from('campaign_influencers')
      .select('id, status, campaign_id')
      .eq('id', ciId)
      .eq('campaign_id', campaignId)
      .single()

    if (fetchError || !ci) {
      return NextResponse.json({ error: '인플루언서를 찾을 수 없습니다.' }, { status: 404 })
    }

    // candidate 상태만 삭제 가능, confirmed는 삭제 불가
    if (ci.status !== 'candidate') {
      return NextResponse.json(
        { error: '후보(candidate) 상태의 인플루언서만 삭제할 수 있습니다.' },
        { status: 400 }
      )
    }

    const { error: deleteError } = await supabase
      .from('campaign_influencers')
      .delete()
      .eq('id', ciId)
      .eq('campaign_id', campaignId)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: '인플루언서가 삭제되었습니다.' })
  } catch (error: any) {
    console.error('Error deleting campaign influencer:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
