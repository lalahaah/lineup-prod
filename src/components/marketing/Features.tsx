export function Features() {
  const featuresList = [
    {
      icon: '👥',
      title: '인플루언서 DB',
      description: '채널별 팔로워, 평균 참여율, 제안 단가, 과거 협업 내역 및 블랙리스트를 한눈에 체계적으로 관리합니다.',
    },
    {
      icon: '🔗',
      title: '광고주 포털',
      description: '로그인 없이 토큰 링크 하나로 광고주가 실시간 후보 인플루언서를 검토하고 1-Click 선택/패스합니다.',
    },
    {
      icon: '✅',
      title: '원고 검수 플로우',
      description: 'v1, v2 이미지/영상 파일과 캡션 피드백 이력을 투명하게 기록하고 에이전시 및 광고주 2단계 검수를 진행합니다.',
    },
    {
      icon: '📦',
      title: '제품 배송 관리',
      description: '인플루언서 배송지 자동 수집, 운송장 번호 입력 및 시트 양식 맞춤 엑셀 다운로드를 지원합니다.',
    },
    {
      icon: '📨',
      title: '이메일 자동화',
      description: 'Resend + React Email 기반 섭외 제안, 수정 요청, 마감 D-day 리마인드 이메일을 자동 발송합니다.',
    },
    {
      icon: '💰',
      title: '정산 및 청구서 생성',
      description: '확정 단가 소계, 대행 수수료 15%, 부가세 10% 자동 계산 및 세금계산서 수취 여부를 대조하여 청구서를 생성합니다.',
    },
  ]

  return (
    <section id="features" className="section select-none" style={{ padding: '80px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ marginBottom: '50px' }}>
          <span className="tag mb-3">Core Features</span>
          <h2 style={{ fontSize: '38px', fontWeight: 700, letterSpacing: '-1px' }}>
            9단계 파이프라인의 핵심 기능
          </h2>
          <p className="muted" style={{ fontSize: '18px', marginTop: '8px' }}>
            운영팀 · 광고주 · 인플루언서가 단 하나의 통합 플랫폼 위에서 협업합니다.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
          {featuresList.map((f, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--white)',
                border: '1px solid var(--dark)',
                borderRadius: '28px',
                boxShadow: 'var(--shadow)',
                padding: '36px 30px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',

              }}
            >
              <div>
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '16px',
                    backgroundColor: 'var(--green)',
                    border: '1px solid var(--dark)',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '26px',
                    marginBottom: '20px',
                  }}
                >
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>{f.title}</h3>
                <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.6 }}>{f.description}</p>
              </div>

              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--line-soft)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: 'var(--dark)' }}>
                <span>자세히 보기</span>
                <svg viewBox="0 0 24 24" fill="none" style={{ width: 16, height: 16 }}>
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="var(--dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
