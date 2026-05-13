import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'

function formatPrice(price: number) {
  return `₩${price.toLocaleString('ko-KR')}`
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diff < 60) return '방금 전'
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`
  return `${Math.floor(diff / 86400)}일 전`
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  예약중: { label: '예약중', className: 'text-white' },
  판매완료: { label: '판매완료', className: 'text-white' },
}

type Product = {
  id: string
  title: string
  price: number
  image_url: string | null
  seller_name: string
  status: string
  created_at: string
}

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
          <button
            className="text-sm font-medium transition-colors"
            style={{ color: '#FFBE6A' }}
            onMouseOver={e => (e.currentTarget.style.color = '#FFD07B')}
            onMouseOut={e => (e.currentTarget.style.color = '#FFBE6A')}
          >
            로그인
          </button>
        </div>
      </header>

      {/* 상품 목록 */}
      <ul className="max-w-screen-sm mx-auto" style={{ borderTop: 'none' }}>
        {products?.map((product: Product) => (
          <li
            key={product.id}
            className="flex gap-4 px-4 py-5 cursor-pointer transition-colors"
            style={{ borderBottom: '1px solid #FFE4BA' }}
            onMouseOver={e => (e.currentTarget.style.background = '#FFF0D6')}
            onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
          >
            {/* 썸네일 */}
            <div
              className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0"
              style={{ background: '#FFE4BA' }}
            >
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">🍠</div>
              )}
            </div>

            {/* 정보 */}
            <div className="flex flex-col justify-between flex-1 min-w-0">
              <div>
                {/* 상태 뱃지 + 제목 */}
                <div className="flex items-center gap-2 flex-wrap">
                  {product.status === '예약중' && (
                    <span
                      className="text-xs font-semibold px-1.5 py-0.5 rounded"
                      style={{ background: '#7C3D00', color: '#fff' }}
                    >
                      예약중
                    </span>
                  )}
                  {product.status === '판매완료' && (
                    <span
                      className="text-xs font-semibold px-1.5 py-0.5 rounded"
                      style={{ background: '#B8A090', color: '#fff' }}
                    >
                      판매완료
                    </span>
                  )}
                  <span
                    className="font-medium truncate"
                    style={{
                      color: product.status === '판매완료' ? '#C4A882' : '#3D1A00',
                      textDecoration: product.status === '판매완료' ? 'line-through' : 'none',
                    }}
                  >
                    {product.title}
                  </span>
                </div>
                {/* 판매자 · 시간 */}
                <p className="text-xs mt-1" style={{ color: '#A0704A' }}>
                  {product.seller_name} · {formatDate(product.created_at)}
                </p>
              </div>

              {/* 가격 */}
              <p
                className="text-sm font-bold"
                style={{ color: product.status === '판매완료' ? '#C4A882' : '#C94E00' }}
              >
                {formatPrice(product.price)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* 상품 등록 버튼 */}
      <button
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 flex items-center justify-center text-2xl shadow-lg transition-colors"
        style={{ background: '#C94E00', color: '#fff' }}
        onMouseOver={e => (e.currentTarget.style.background = '#A33D00')}
        onMouseOut={e => (e.currentTarget.style.background = '#C94E00')}
      >
        +
      </button>
    </main>
  )
}
