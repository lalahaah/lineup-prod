import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createServiceClient()

    // 진행 중 캠페인 수
    const { count: campaignCount } = await supabase
      .from('campaigns')
      .select('*', { count: 'exact', head: true })
      .not('stage', 'eq', 'done')

    // 원고 검수 대기 수
    const { count: draftCount } = await supabase
      .from('drafts')
      .select('*', { count: 'exact', head: true })
      .in('status', ['submitted', 'revision_requested', 'agency_approved'])

    return NextResponse.json({
      campaigns: campaignCount || 0,
      drafts: draftCount || 0,
    })
  } catch (error: any) {
    console.error('Error fetching sidebar counts:', error)
    return NextResponse.json({
      campaigns: 0,
      drafts: 0,
    })
  }
}
