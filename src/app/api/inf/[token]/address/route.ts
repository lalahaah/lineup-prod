import { NextResponse, NextRequest } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  try {
    const body = await request.json()
    const { name, phone, address, detail_address } = body

    console.log(`[Inf Shipping Address] Token: ${token}, Address:`, { name, phone, address, detail_address })

    return NextResponse.json({
      success: true,
      shipping_address: { name, phone, address, detail_address },
      token,
    })
  } catch (error) {
    console.error('Error submitting shipping address:', error)
    return NextResponse.json({ error: 'Failed to submit address' }, { status: 500 })
  }
}
