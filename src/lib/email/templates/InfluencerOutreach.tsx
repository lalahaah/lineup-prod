import React from 'react'
import {
  Html, Head, Body, Container, Section,
  Text, Button, Hr, Preview
} from '@react-email/components'

interface Props {
  influencerName: string
  brandName: string
  campaignName: string
  productName: string
  contentDeadline: string
  uploadDeadline: string
  fee?: number
  responseLink: string
  managerName: string
}

export function InfluencerOutreach({
  influencerName,
  brandName,
  campaignName,
  productName,
  contentDeadline,
  uploadDeadline,
  fee,
  responseLink,
  managerName,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>{brandName} 협찬 제안 드립니다</Preview>
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
              {influencerName} 님, 안녕하세요 👋
            </Text>
            <Text style={{
              fontSize: '15px',
              color: '#4E5968',
              lineHeight: '1.7',
              margin: '0 0 24px',
            }}>
              라운드미디어에서 <strong>{brandName}</strong>의 
              협찬 제안을 드립니다.
              아래 내용을 확인하시고 수락 여부를 선택해 주세요.
            </Text>

            {/* 캠페인 정보 박스 */}
            <Section style={{
              backgroundColor: '#B9FF66',
              borderRadius: '12px',
              border: '1px solid #191A23',
              padding: '20px 24px',
              margin: '0 0 24px',
            }}>
              <Text style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#191A23',
                margin: '0 0 14px',
              }}>
                {campaignName}
              </Text>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ 
                      fontSize: '13px', 
                      color: '#333D4B',
                      padding: '4px 0',
                      width: '50%'
                    }}>
                      📦 제품
                    </td>
                    <td style={{ 
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#191A23',
                      padding: '4px 0'
                    }}>
                      {productName}
                    </td>
                  </tr>
                  {fee !== undefined && fee !== null && (
                    <tr>
                      <td style={{ fontSize: '13px', color: '#333D4B', padding: '4px 0' }}>
                        💰 제안 단가
                      </td>
                      <td style={{ fontSize: '13px', fontWeight: '500', color: '#191A23', padding: '4px 0' }}>
                        ₩{fee.toLocaleString()}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td style={{ fontSize: '13px', color: '#333D4B', padding: '4px 0' }}>
                      📅 원고 마감
                    </td>
                    <td style={{ fontSize: '13px', fontWeight: '500', color: '#191A23', padding: '4px 0' }}>
                      {contentDeadline}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontSize: '13px', color: '#333D4B', padding: '4px 0' }}>
                      📅 업로드 희망일
                    </td>
                    <td style={{ fontSize: '13px', fontWeight: '500', color: '#191A23', padding: '4px 0' }}>
                      {uploadDeadline}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* CTA 버튼 */}
            <Button
              href={responseLink}
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
              내용 확인 및 수락/거절하기 →
            </Button>

            <Hr style={{ borderColor: '#E5E8EB', margin: '24px 0' }} />

            <Text style={{
              fontSize: '13px',
              color: '#8B95A1',
              lineHeight: '1.6',
              margin: 0,
            }}>
              본 메일은 라운드미디어를 통해 발송됐습니다.<br />
              문의사항은 담당자 {managerName}에게 연락해 주세요.<br />
              링크는 해당 캠페인 종료 시까지 유효합니다.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
