import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '인플루언서 링크 안내 - Lineup',
  description: '인플루언서에게 발송된 개인 응답 링크 안내 페이지입니다.',
}

export default function InfluencerInfoPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        padding: '24px',
      }}
    >
      <div
        style={{
          background: 'white',
          border: '1px solid var(--dark)',
          borderRadius: 20,
          boxShadow: '0 4px 0 0 var(--dark)',
          maxWidth: 480,
          width: '100%',
          padding: '36px 32px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
        }}
      >
        {/* 아이콘 */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: 'var(--green)',
            border: '1px solid var(--dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
          }}
        >
          📱
        </div>

        {/* 제목 및 설명 */}
        <div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: 'var(--dark)',
              margin: '0 0 10px',
              letterSpacing: '-0.02em',
            }}
          >
            인플루언서 링크
          </h1>
          <p
            style={{
              fontSize: 14,
              color: 'var(--muted)',
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            인플루언서에게 발송된 개인 링크입니다.
            <br />
            링크는 섭외 이메일을 통해 인플루언서에게 전달됩니다.
          </p>
        </div>

        {/* 안내 박스 */}
        <div
          style={{
            width: '100%',
            background: 'var(--gray)',
            border: '1px solid var(--line-soft)',
            borderRadius: 12,
            padding: '16px',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--muted)',
              marginBottom: 6,
            }}
          >
            인플루언서 링크 예시:
          </div>
          <div
            style={{
              fontSize: 13,
              fontFamily: 'monospace',
              color: 'var(--dark)',
              background: 'white',
              border: '1px solid var(--line-soft)',
              borderRadius: 8,
              padding: '8px 12px',
              wordBreak: 'break-all',
            }}
          >
            http://localhost:3000/inf/[토큰]
          </div>
        </div>

        {/* 하단 버튼 */}
        <Link
          href="/campaigns"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: '12px 24px',
            background: 'var(--green)',
            color: 'var(--dark)',
            border: '1px solid var(--dark)',
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            textDecoration: 'none',
            boxShadow: '0 2px 0 0 var(--dark)',
            transition: 'all 0.15s ease',
          }}
        >
          캠페인으로 이동
        </Link>
      </div>
    </div>
  )
}
