import { Resend } from 'resend'
import React from 'react'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface SendEmailParams {
  to: string
  subject: string
  react: React.ReactElement
  campaignId?: string
  influencerId?: string
}

export async function sendEmail({
  to,
  subject,
  react,
}: SendEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Lineup <onboarding@resend.dev>',
      to,
      subject,
      react,
    })
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('이메일 발송 오류:', error)
    return { success: false, error }
  }
}
