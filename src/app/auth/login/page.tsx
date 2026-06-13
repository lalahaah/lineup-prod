'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Logo } from '@/components/shared/Logo'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useTransition, Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isPending, startTransition] = useTransition()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('이메일과 비밀번호를 입력해주세요.')
      return
    }

    startTransition(async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(`로그인 실패: ${error.message}`)
        return
      }

      toast.success('로그인에 성공했습니다!')
      const redirectTo = searchParams?.get('redirectTo') || '/dashboard'
      router.refresh()
      router.push(redirectTo)
    })
  }

  return (
    <div 
      className="bg-white border border-[var(--dark)] rounded-[28px] p-8"
      style={{ boxShadow: "0 4px 0 0 var(--dark)" }}
    >
      <div className="mb-6 space-y-1">
        <h3 className="text-xl font-bold tracking-tight text-[var(--dark)]">로그인</h3>
        <p className="text-xs text-[var(--muted)]">등록된 이메일과 비밀번호를 입력해주세요.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-semibold text-[var(--dark)]">이메일</label>
          <input
            id="email"
            type="email"
            placeholder="name@agency.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
            className="w-full border border-[var(--dark)] rounded-[12px] bg-white text-[var(--dark)] outline-none font-sans"
            style={{ padding: '13px 16px' }}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-semibold text-[var(--dark)]">비밀번호</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
            className="w-full border border-[var(--dark)] rounded-[12px] bg-white text-[var(--dark)] outline-none font-sans"
            style={{ padding: '13px 16px' }}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[var(--dark)] text-white rounded-[12px] border border-[var(--dark)] font-bold transition-all duration-150 cursor-pointer hover:bg-[var(--green)] hover:text-[var(--dark)]"
          style={{ padding: '13px 16px' }}
        >
          {isPending ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--gray)] p-4 font-sans text-[var(--dark)]">
      <div className="w-full max-w-[420px] space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Logo size={34} className="mb-2" />
          <h2 className="text-2xl font-bold tracking-tight text-[var(--dark)]">Lineup 캠페인 운영 OS</h2>
          <p className="text-sm text-[var(--muted)]">섭외부터 정산까지의 원스톱 파이프라인 관리 플랫폼</p>
        </div>

        <Suspense fallback={
          <div className="bg-white border border-[var(--dark)] rounded-[28px] p-8 text-center" style={{ boxShadow: '0 4px 0 0 var(--dark)' }}>
            <p className="text-sm text-[var(--muted)]">로그인 폼을 불러오는 중...</p>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
