import { NextResponse, NextRequest } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  try {
    const body = await request.json()
    const { action } = body

    console.log(`[Inf Response] Token: ${token}, Action: ${action}`)

    return NextResponse.json({
      success: true,
      action,
      token,
    })
  } catch (error) {
    console.error('Error submitting influencer response:', error)
    return NextResponse.json({ error: 'Failed to submit response' }, { status: 500 })
  }
}
