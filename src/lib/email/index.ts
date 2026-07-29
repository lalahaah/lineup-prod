import React from 'react'
import { Resend } from 'resend'

export interface SendEmailParams {
  to: string
  subject: string
  react: React.ReactElement
  campaignId?: string
  influencerId?: string
  templateId?: string
}

export async function sendEmail(params: SendEmailParams) {
  try {
    const apiKey = process.env.RESEND_API_KEY

    // RESEND_API_KEY가 없거나 mock key인 경우 콘솔 시뮬레이션
    if (!apiKey || apiKey.startsWith('re_mock')) {
      console.log('[Mock Email Sent]', {
        to: params.to,
        subject: params.subject,
        campaignId: params.campaignId,
        influencerId: params.influencerId,
      })
      return { success: true, data: { id: `mock-email-${Date.now()}` } }
    }

    const resend = new Resend(apiKey)

    const { data, error } = await resend.emails.send({
      from: 'Lineup <noreply@lineup.so>',
      to: params.to,
      subject: params.subject,
      react: params.react,
    })

    if (error) throw error

    console.log('Email sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Email error:', error)
    return { success: false, error }
  }
}
