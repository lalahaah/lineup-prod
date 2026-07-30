import { NextResponse, NextRequest } from 'next/server'
import { MOCK_CLIENTS, MOCK_CLIENT_CAMPAIGNS } from '@/lib/clientsStore'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const client = MOCK_CLIENTS.find((c) => c.id === id || c.name.toLowerCase() === id.toLowerCase())

    if (!client) {
      return NextResponse.json({ error: '광고주를 찾을 수 없습니다.' }, { status: 404 })
    }

    const campaigns = MOCK_CLIENT_CAMPAIGNS[client.id] || []

    return NextResponse.json({
      data: client,
      campaigns
    })
  } catch (error) {
    console.error('Error fetching client detail:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const index = MOCK_CLIENTS.findIndex((c) => c.id === id || c.name.toLowerCase() === id.toLowerCase())

    if (index === -1) {
      return NextResponse.json({ error: '광고주를 찾을 수 없습니다.' }, { status: 404 })
    }

    const body = await request.json()
    const target = MOCK_CLIENTS[index]

    const updated = {
      ...target,
      ...body,
      id: target.id
    }

    MOCK_CLIENTS[index] = updated

    return NextResponse.json({ data: updated })
  } catch (error) {
    console.error('Error updating client:', error)
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 })
  }
}
