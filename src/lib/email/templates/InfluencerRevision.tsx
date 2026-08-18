import React from 'react'
import {
  Html, Head, Body, Container, Section, Text, Button, Hr, Preview
} from '@react-email/components'

interface Props {
  influencerName: string
  campaignName: string
  brandName: string
  feedback: string
  resubmitLink: string
}

export function InfluencerRevision({
  influencerName = '인플루언서',
  campaignName = '캠페인',
  brandName = '광고주',
  feedback = '수정 요청 사항을 확인해 주세요.',
  resubmitLink = 'http://localhost:3000/inf',
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>[{brandName}] 원고 수정 요청 안내입니다</Preview>
      <Body style={{
        backgroundColor: '#F3F3F3',
        fontFamily: 'Arial, sans-serif'
      }}>
        <Container style={{
          maxWidth: '560px',
          margin: '40px auto',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #191A23',
          overflow: 'hidden',
        }}>
          {/* 헤더 */}
          <Section style={{
            backgroundColor: '#191A23',
            padding: '24px 32px',
          }}>
            <Text style={{
              color: '#B9FF66',
              fontSize: '22px',
              fontWeight: '700',
              margin: 0,
            }}>
              Lineup
            </Text>
            <Text style={{
              color: '#9A9BA5',
              fontSize: '13px',
              margin: '4px 0 0',
            }}>
              by 라운드미디어
            </Text>
          </Section>

          {/* 본문 */}
          <Section style={{ padding: '32px' }}>
            <Text style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#191A23',
              margin: '0 0 8px',
            }}>
              {influencerName} 님, 원고 수정 요청드립니다
            </Text>
            <Text style={{
              fontSize: '15px',
              color: '#4E5968',
              lineHeight: '1.7',
              margin: '0 0 24px',
            }}>
              제출해주신 <strong>{campaignName}</strong>({brandName}) 원고에 대해 아래 피드백 내용을 참고하여 수정 후 재제출해 주세요.
            </Text>

            {/* 피드백 박스 */}
            <Section style={{
              backgroundColor: '#F3F3F3',
              borderRadius: '12px',
              border: '1px solid #E5E8EB',
              padding: '20px 24px',
              margin: '0 0 24px',
            }}>
              <Text style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#191A23',
                margin: '0 0 8px',
              }}>
                💬 수정 요청 피드백
              </Text>
              <Text style={{
                fontSize: '14px',
                color: '#333D4B',
                lineHeight: '1.6',
                margin: 0,
                whiteSpace: 'pre-wrap',
              }}>
                {feedback}
              </Text>
            </Section>

            {/* CTA 버튼 */}
            <Button
              href={resubmitLink}
              style={{
                backgroundColor: '#191A23',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: '600',
                padding: '14px 28px',
                borderRadius: '10px',
                display: 'block',
                textAlign: 'center',
                textDecoration: 'none',
                margin: '0 0 24px',
              }}
            >
              원고 재제출하기 →
            </Button>

            <Hr style={{ borderColor: '#E5E8EB', margin: '24px 0' }} />

            <Text style={{
              fontSize: '13px',
              color: '#8B95A1',
              lineHeight: '1.6',
              margin: 0,
            }}>
              본 메일은 라운드미디어를 통해 발송됐습니다.<br />
              문의사항은 담당자에게 연락해 주세요.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
