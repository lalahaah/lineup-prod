import { NextResponse, NextRequest } from 'next/server'
import { sendEmail } from '@/lib/email'
import { InfluencerOutreach } from '@/lib/email/templates/InfluencerOutreach'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; ci_id: string }> }
) {
  const { id, ci_id } = await params

  try {
    const responseLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/inf/mock-inf-token-001`

    const emailResult = await sendEmail({
      to: 'yuri_cooks@example.com',
      subject: '[CUCKOO] 쿠쿠 트윈프레셔 신제품 런칭 캠페인 협업 제안드립니다',
      campaignId: id,
      influencerId: ci_id,
      react: InfluencerOutreach({
        influencerName: '유리쿡',
        campaignName: '쿠쿠 트윈프레셔 신제품 런칭',
        brandName: 'CUCKOO',
        productName: '쿠쿠 트윈프레셔 IH',
        contentDeadline: '06.08',
        uploadDeadline: '06.10',
        fee: '₩800,000',
        responseLink,
        managerName: '김현우',
      }),
    })

    console.log(`[Outreach Email] Campaign: ${id}, CI_ID: ${ci_id}, Result:`, emailResult)

    return NextResponse.json({
      success: true,
      message: '섭외 이메일이 발송됐습니다',
      ci_id,
      status: 'outreached',
    })
  } catch (error) {
    console.error('Error sending outreach email:', error)
    return NextResponse.json({ error: 'Failed to send outreach email' }, { status: 500 })
  }
}
