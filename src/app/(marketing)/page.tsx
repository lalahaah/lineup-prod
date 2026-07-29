import { Hero } from '@/components/marketing/Hero'
import { Problem } from '@/components/marketing/Problem'
import { Features } from '@/components/marketing/Features'
import { Pricing } from '@/components/marketing/Pricing'

export default function LandingPage() {
  return (
    <div>
      <Hero />
      <Problem />
      <Features />
      <Pricing />
    </div>
  )
}
