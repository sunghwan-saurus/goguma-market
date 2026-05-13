import { createClient } from '@/lib/supabase/server'
import Header from '@/components/Header'
import ProductList from '@/components/ProductList'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  const [{ data: products }, { data: { user } }] = await Promise.all([
    supabase.from('products').select('id, title, price, image_url, seller_name, status, created_at').order('created_at', { ascending: false }),
    supabase.auth.getUser(),
  ])

  return (
    <main className="min-h-screen" style={{ background: '#FFF6E8' }}>
      <Header />
      <ProductList products={products ?? []} />

      {user && (
        <Link
          href="/products/new"
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 flex items-center justify-center text-2xl shadow-lg"
          style={{ background: '#C94E00', color: '#fff' }}
          aria-label="상품 등록"
        >
          +
        </Link>
      )}
    </main>
  )
}
