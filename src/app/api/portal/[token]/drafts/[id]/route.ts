import { NextResponse, NextRequest } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string; id: string }> }
) {
  const { token, id } = await params
  try {
    const body = await request.json()
    const { action, feedback } = body

    console.log(`[Portal Draft Action] Token: ${token}, ID: ${id}, Action: ${action}, Feedback: ${feedback}`)

    return NextResponse.json({
      success: true,
      action,
      draft_id: id,
    })
  } catch (error) {
    console.error('Error handling portal draft action:', error)
    return NextResponse.json({ error: 'Failed to process action' }, { status: 500 })
  }
}
