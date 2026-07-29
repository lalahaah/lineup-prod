import { NextResponse, NextRequest } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  try {
    const body = await request.json()
    const { caption, file_url } = body

    console.log(`[Inf Draft Submission] Token: ${token}, Caption: ${caption}, File: ${file_url}`)

    return NextResponse.json({
      success: true,
      message: '원고가 제출되었습니다.',
      token,
    })
  } catch (error) {
    console.error('Error submitting draft:', error)
    return NextResponse.json({ error: 'Failed to submit draft' }, { status: 500 })
  }
}
