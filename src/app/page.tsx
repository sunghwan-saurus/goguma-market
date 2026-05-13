import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import ProductList from '@/components/ProductList'

export default async function Home() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('id, title, price, image_url, seller_name, status, created_at')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen" style={{ background: '#FFF6E8' }}>
      {/* 헤더 */}
      <header className="sticky top-0 z-10" style={{ background: '#5C2D0E', borderBottom: '1px solid #3D1A00' }}>
        <div className="max-w-screen-sm mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold" style={{ color: '#FFD07B' }}>🍠 고구마마켓</h1>
          <Link
            href="/products/new"
            className="text-sm font-semibold px-3 py-1.5 rounded-lg"
            style={{ background: '#C94E00', color: '#fff' }}
          >
            상품 등록
          </Link>
        </div>
      </header>

      <ProductList products={products ?? []} />

      {/* 상품 등록 FAB */}
      <Link
        href="/products/new"
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 flex items-center justify-center text-2xl shadow-lg"
        style={{ background: '#C94E00', color: '#fff' }}
        aria-label="상품 등록"
      >
        +
      </Link>
    </main>
  )
}
