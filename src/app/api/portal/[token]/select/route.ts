import { NextResponse, NextRequest } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  try {
    const body = await request.json()
    const { selections } = body

    console.log(`[Portal Selection] Token: ${token}, Selections:`, selections)

    return NextResponse.json({
      success: true,
      message: '운영팀에 전달되었습니다',
      token,
    })
  } catch (error) {
    console.error('Error submitting portal selections:', error)
    return NextResponse.json({ error: 'Failed to submit selection' }, { status: 500 })
  }
}
