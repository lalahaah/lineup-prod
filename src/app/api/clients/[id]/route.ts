import { NextResponse, NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const supabase = createServiceClient()

    const { data: client, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !client) {
      return NextResponse.json({ error: '광고주를 찾을 수 없습니다.' }, { status: 404 })
    }

    // 해당 광고주의 캠페인 이력 조회
    const { data: campaigns } = await supabase
      .from('campaigns')
      .select('*')
      .eq('client_id', id)
      .order('created_at', { ascending: false })

    const formattedCampaigns = (campaigns || []).map((c: any) => ({
      id: c.id,
      title: c.name,
      stage: c.stage,
      stage_label: c.stage,
      progress_days: `진행중`,
      amount: c.budget ? `₩${c.budget.toLocaleString()}` : '-'
    }))

    return NextResponse.json({
      data: client,
      campaigns: formattedCampaigns
    })
  } catch (error: any) {
    console.error('Error fetching client detail:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const supabase = createServiceClient()
    const body = await request.json()

    const { data: updated, error } = await supabase
      .from('clients')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error || !updated) {
      return NextResponse.json({ error: error?.message || 'Failed to update client' }, { status: 500 })
    }

    return NextResponse.json({ data: updated })
  } catch (error: any) {
    console.error('Error updating client:', error)
    return NextResponse.json({ error: error.message || 'Failed to update client' }, { status: 500 })
  }
}
