import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import LogoutButton from './LogoutButton'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const displayName = user?.user_metadata?.full_name
    || user?.user_metadata?.name
    || user?.email?.split('@')[0]
    || null

  return (
    <header className="sticky top-0 z-10" style={{ background: '#5C2D0E', borderBottom: '1px solid #3D1A00' }}>
      <div className="max-w-screen-sm mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="text-lg font-bold shrink-0" style={{ color: '#FFD07B' }}>
          🍠 고구마마켓
        </Link>

        <div className="flex items-center gap-2 min-w-0">
          {user ? (
            <>
              <span className="text-xs truncate max-w-[100px]" style={{ color: '#FFBE6A' }}>
                {displayName}
              </span>
              <Link
                href="/products/new"
                className="text-xs font-semibold px-3 py-1.5 rounded-lg shrink-0"
                style={{ background: '#C94E00', color: '#fff' }}
              >
                상품 등록
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm font-semibold px-3 py-1.5 rounded-lg"
              style={{ background: '#C94E00', color: '#fff' }}
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
