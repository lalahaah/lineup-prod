import { NextResponse, NextRequest } from 'next/server'
import { MOCK_CLIENTS, ClientData } from '@/lib/clientsStore'

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      data: MOCK_CLIENTS,
      total: MOCK_CLIENTS.length
    })
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, industry, contact_name, contact_email, contact_phone, commission_rate, notes } = body

    if (!name || !name.trim()) {
      return NextResponse.json({ error: '회사명은 필수입니다.' }, { status: 400 })
    }

    const newClient: ClientData = {
      id: `client-${Date.now()}`,
      name: name.trim(),
      industry: industry?.trim() || '기타',
      contact_name: contact_name?.trim() || '-',
      contact_email: contact_email?.trim() || '-',
      contact_phone: contact_phone?.trim() || '-',
      commission_rate: typeof commission_rate === 'number' ? commission_rate : parseFloat(commission_rate || '0.15'),
      is_active: true,
      notes: notes?.trim() || '',
      campaign_count: 0,
      created_at: new Date().toISOString().split('T')[0]
    }

    MOCK_CLIENTS.unshift(newClient)

    return NextResponse.json(newClient, { status: 201 })
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 })
  }
}
