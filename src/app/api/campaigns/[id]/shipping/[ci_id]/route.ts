import { NextResponse, NextRequest } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; ci_id: string }> }
) {
  const { id, ci_id } = await params
  try {
    const body = await request.json()
    const { tracking_number, status } = body

    console.log(`[Shipping Patch] Campaign: ${id}, CI_ID: ${ci_id}, Tracking: ${tracking_number}, Status: ${status}`)

    return NextResponse.json({
      success: true,
      ci_id,
      tracking_number,
      status: status || 'shipped',
    })
  } catch (error) {
    console.error('Error updating shipping item:', error)
    return NextResponse.json({ error: 'Failed to update shipping item' }, { status: 500 })
  }
}
