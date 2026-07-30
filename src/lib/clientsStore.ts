export interface ClientData {
  id: string
  name: string
  industry: string
  contact_name: string
  contact_email: string
  contact_phone?: string
  commission_rate: number
  is_active: boolean
  notes?: string
  campaign_count?: number
  created_at?: string
}

export const MOCK_CLIENTS: ClientData[] = [
  {
    id: 'client-1',
    name: 'CUCKOO',
    industry: '가전',
    contact_name: '김마케터',
    contact_email: 'marketing@cuckoo.co.kr',
    contact_phone: '010-1234-5678',
    commission_rate: 0.15,
    is_active: true,
    campaign_count: 5,
    notes: '주요 광고주 (쿠쿠전자 브랜드)',
    created_at: '2026-01-15'
  },
  {
    id: 'client-2',
    name: '유한킴벌리',
    industry: 'FMCG',
    contact_name: '이담당',
    contact_email: 'marketing@yuhan.co.kr',
    contact_phone: '010-2345-6789',
    commission_rate: 0.15,
    is_active: true,
    campaign_count: 2,
    notes: '위생용품 및 뷰티 케어 라인업',
    created_at: '2026-02-01'
  },
  {
    id: 'client-3',
    name: 'CJ올리브영',
    industry: '뷰티/헬스',
    contact_name: '박매니저',
    contact_email: 'marketing@oliveyoung.co.kr',
    contact_phone: '010-3456-7890',
    commission_rate: 0.15,
    is_active: true,
    campaign_count: 3,
    notes: '올리브영 뷰티 픽 파이프라인 전용',
    created_at: '2026-03-10'
  },
]

export const MOCK_CLIENT_CAMPAIGNS: Record<string, Array<{
  id: string
  title: string
  stage: string
  stage_label: string
  progress_days: string
  amount: string
}>> = {
  'client-1': [
    { id: 'camp-1', title: '쿠쿠 트윈프레셔 신제품 런칭', stage: 'review', stage_label: '검수', progress_days: '진행 12일차 (D-2)', amount: '₩15,000,000' },
    { id: 'camp-3', title: '쿠쿠 에어프라이어 봄 캠페인', stage: 'proposal', stage_label: '제안', progress_days: '진행 5일차 (D-3)', amount: '₩8,500,000' },
    { id: 'camp-5', title: '쿠쿠 정수기 인스타 협찬', stage: 'outreach', stage_label: '섭외', progress_days: '진행 8일차 (D-3)', amount: '₩12,000,000' },
    { id: 'camp-8', title: '쿠쿠 밥솥 추석 기획전', stage: 'selection', stage_label: '선택', progress_days: '진행 3일차 (D-6)', amount: '₩20,000,000' },
    { id: 'camp-9', title: '쿠쿠 비스포크 홈카페', stage: 'uploaded', stage_label: '업로드', progress_days: '진행 20일차 (D-4)', amount: '₩6,400,000' },
  ],
  'client-2': [
    { id: 'camp-2', title: '크리넥스 항균 티슈 협찬', stage: 'search', stage_label: '서치', progress_days: '진행 4일차 (D-9)', amount: '₩5,500,000' },
    { id: 'camp-7', title: '하기스 위생 캠페인', stage: 'shipping', stage_label: '배송', progress_days: '진행 10일차 (D-5)', amount: '₩9,000,000' },
  ],
  'client-3': [
    { id: 'camp-4', title: '올리브영 뷰티 픽 11월', stage: 'proposal', stage_label: '제안', progress_days: '진행 2일차 (D-8)', amount: '₩11,000,000' },
    { id: 'camp-10', title: '올리브영 뷰티 신제품', stage: 'billing', stage_label: '정산', progress_days: '진행 25일차 (D-6)', amount: '₩8,400,000' },
  ]
}
