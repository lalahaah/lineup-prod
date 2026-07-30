import { NextResponse, NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceClient()

    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data: clients || [],
      total: (clients || []).length
    })
  } catch (error: any) {
    console.error('Error fetching clients:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceClient()
    const body = await request.json()

    const { name, industry, contact_name, contact_email, contact_phone, commission_rate, notes } = body

    if (!name || !name.trim()) {
      return NextResponse.json({ error: '회사명은 필수입니다.' }, { status: 400 })
    }

    const insertData = {
      name: name.trim(),
      industry: industry?.trim() || '기타',
      contact_name: contact_name?.trim() || null,
      contact_email: contact_email?.trim() || null,
      contact_phone: contact_phone?.trim() || null,
      commission_rate: typeof commission_rate === 'number' ? commission_rate : parseFloat(commission_rate || '0.15'),
      is_active: true,
      notes: notes?.trim() || null,
      plan_type: 'starter'
    }

    const { data: newClient, error } = await supabase
      .from('clients')
      .insert(insertData)
      .select()
      .single()

    if (error || !newClient) {
      return NextResponse.json({ error: error?.message || 'Failed to create client' }, { status: 500 })
    }

    return NextResponse.json(newClient, { status: 201 })
  } catch (error: any) {
    console.error('Error creating client:', error)
    return NextResponse.json({ error: error.message || 'Failed to create client' }, { status: 500 })
  }
}
