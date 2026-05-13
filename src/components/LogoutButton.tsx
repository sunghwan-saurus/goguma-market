'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="text-xs font-semibold px-3 py-1.5 rounded-lg"
      style={{ background: '#3D1A00', color: '#FFBE6A' }}
    >
      로그아웃
    </button>
  )
}
