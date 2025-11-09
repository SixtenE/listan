import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'

export default async function Page() {
  return (
    <main className="bg-background min-h-screen">
      <Header />
      <Hero />
    </main>
  )
}
