import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/Sidebar'

interface AppLayoutProps {
  children: React.ReactNode
}

export default async function AppLayout({ children }: AppLayoutProps) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-soft)] text-[var(--ink)]">
      {/* Sidebar (좌, 고정 너비 220px) */}
      <Sidebar className="flex-shrink-0" />

      {/* Main Content Area (우, flex-1) */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
