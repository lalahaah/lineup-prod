export function Problem() {
  return (
    <section
      id="problem"
      className="section select-none"
      style={{
        backgroundColor: '#191A23',
        color: '#FFFFFF',
        padding: '80px 0',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div
            style={{
              display: 'inline-block',
              backgroundColor: '#2A2B36',
              color: '#B9FF66',
              border: '1px solid #3A3B4A',
              borderRadius: '999px',
              padding: '6px 18px',
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '16px',
            }}
          >
            기존 캠페인 운영의 문제점
          </div>
          <h2
            style={{
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '-1px',
              marginBottom: '16px',
            }}
          >
            캠페인 1건에 8시간의 행정 업무
          </h2>
          <p style={{ fontSize: '18px', color: '#9A9BA5', maxWidth: '640px', margin: '0 auto' }}>
            엑셀과 카카오톡, 이메일을 넘나들며 버려지는 무수한 불필요 행정 시간을 혁신합니다.
          </p>
        </div>

        {/* 2x2 Problem Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '24px' }}>
          <div
            style={{
              backgroundColor: '#24252E',
              border: '1px solid #3A3B47',
              borderRadius: '24px',
              padding: '32px',
            }}
          >
            <div style={{ fontSize: '52px', fontWeight: 700, color: 'var(--green)', lineHeight: 1 }}>
              2h
            </div>
            <div style={{ fontSize: '18px', fontWeight: 600, marginTop: '16px', marginBottom: '8px' }}>
              보고서 작성
            </div>
            <p style={{ fontSize: '14px', color: '#9A9BA5', lineHeight: 1.6 }}>
              광고주 수동 보고를 위해 수십 개의 엑셀 캡처, 인플루언서 지표를 취합하던 수작업 시간
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#24252E',
              border: '1px solid #3A3B47',
              borderRadius: '24px',
              padding: '32px',
            }}
          >
            <div style={{ fontSize: '52px', fontWeight: 700, color: 'var(--green)', lineHeight: 1 }}>
              3h
            </div>
            <div style={{ fontSize: '18px', fontWeight: 600, marginTop: '16px', marginBottom: '8px' }}>
              인플루언서 컨택
            </div>
            <p style={{ fontSize: '14px', color: '#9A9BA5', lineHeight: 1.6 }}>
              개별 인스타그램 DM, 이메일 일일이 발송하고 수락/거절 여부를 수동으로 팔로업하던 시간
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#24252E',
              border: '1px solid #3A3B47',
              borderRadius: '24px',
              padding: '32px',
            }}
          >
            <div style={{ fontSize: '52px', fontWeight: 700, color: 'var(--green)', lineHeight: 1 }}>
              2h
            </div>
            <div style={{ fontSize: '18px', fontWeight: 600, marginTop: '16px', marginBottom: '8px' }}>
              원고 검수
            </div>
            <p style={{ fontSize: '14px', color: '#9A9BA5', lineHeight: 1.6 }}>
              v1, v2 영상/이미지 파일 및 캡션 피드백을 카톡으로 보내고 교차 확인하던 번거로움
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#24252E',
              border: '1px solid #3A3B47',
              borderRadius: '24px',
              padding: '32px',
            }}
          >
            <div style={{ fontSize: '52px', fontWeight: 700, color: 'var(--green)', lineHeight: 1 }}>
              1h
            </div>
            <div style={{ fontSize: '18px', fontWeight: 600, marginTop: '16px', marginBottom: '8px' }}>
              정산 및 증빙
            </div>
            <p style={{ fontSize: '14px', color: '#9A9BA5', lineHeight: 1.6 }}>
              수수료 15%, 부가세 10%, 세금계산서 수취 여부를 인플루언서별로 개별 대조하던 시간
            </p>
          </div>
        </div>

        {/* Conversion Banner */}
        <div
          style={{
            marginTop: '40px',
            backgroundColor: '#2A2B36',
            border: '2px solid var(--green)',
            borderRadius: '24px',
            padding: '28px 36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div>
            <div style={{ fontSize: '14px', color: '#9A9BA5' }}>Lineup 솔루션 적용 효과</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', marginTop: '4px' }}>
              캠페인 행정 시간 <span style={{ color: 'var(--green)' }}>8시간 → 1시간</span>으로 단축
            </div>
          </div>
          <div
            style={{
              backgroundColor: 'var(--green)',
              color: 'var(--dark)',
              fontWeight: 700,
              fontSize: '18px',
              padding: '12px 24px',
              borderRadius: '14px',
            }}
          >
            업무 효율 87.5% UP
          </div>
        </div>
      </div>
    </section>
  )
}
