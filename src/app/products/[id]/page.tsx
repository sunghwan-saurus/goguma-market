import { createClient } from '@/lib/supabase/server'
import BackButton from '@/components/BackButton'
import DeleteButton from '@/components/DeleteButton'
import StatusSelect from '@/components/StatusSelect'
import Header from '@/components/Header'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

function formatPrice(price: number) {
  return `₩${price.toLocaleString('ko-KR')}`
}

function formatFullDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: product }, { data: { user } }] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).single(),
    supabase.auth.getUser(),
  ])

  if (!product) notFound()

  const isSold = product.status === '판매완료'
  const isOwner = !!user && user.id === product.user_id
  const sellerInitial = product.seller_name?.charAt(0) ?? '?'

  return (
    <div className="min-h-screen pb-24" style={{ background: '#FFF6E8' }}>
      <header className="sticky top-0 z-10" style={{ background: '#5C2D0E', borderBottom: '1px solid #3D1A00' }}>
        <div className="max-w-screen-sm mx-auto px-2 py-2 flex items-center gap-2">
          <BackButton />
          <span className="font-bold text-base flex-1 truncate" style={{ color: '#FFD07B' }}>
            {product.title}
          </span>
          {isOwner && (
            <div className="flex gap-2 shrink-0">
              <Link
                href={`/products/${id}/edit`}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                style={{ background: '#C94E00', color: '#fff' }}
              >
                수정
              </Link>
              <DeleteButton id={id} />
            </div>
          )}
        </div>
      </header>

      <div className="max-w-screen-sm mx-auto">
        {/* 상품 이미지 */}
        <div className="relative w-full aspect-square" style={{ background: '#FFE4BA' }}>
          {product.image_url ? (
            <Image src={product.image_url} alt={product.title} fill className="object-cover" sizes="100vw" priority />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">🍠</div>
          )}
          {isSold && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)' }}>
              <span className="text-white text-2xl font-bold tracking-widest">판매완료</span>
            </div>
          )}
        </div>

        {/* 판매자 정보 */}
        <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom: '1px solid #FFE4BA' }}>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
            style={{ background: '#7C3D00', color: '#FFD07B' }}
          >
            {sellerInitial}
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: '#3D1A00' }}>{product.seller_name}</p>
            <p className="text-xs mt-0.5" style={{ color: '#A0704A' }}>판매자</p>
          </div>
        </div>

        {/* 상품 정보 */}
        <div className="px-4 py-5" style={{ borderBottom: '1px solid #FFE4BA' }}>
          {isOwner ? (
            <div className="mb-3">
              <StatusSelect id={id} current={product.status as '판매중' | '예약중' | '판매완료'} />
            </div>
          ) : (
            <div className="mb-3">
              {product.status !== '판매중' && (
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded"
                  style={{ background: product.status === '예약중' ? '#7C3D00' : '#B8A090', color: '#fff' }}
                >
                  {product.status}
                </span>
              )}
            </div>
          )}

          <h1
            className="text-xl font-bold leading-snug"
            style={{ color: isSold ? '#C4A882' : '#3D1A00', textDecoration: isSold ? 'line-through' : 'none' }}
          >
            {product.title}
          </h1>
          <p className="text-xs mt-2" style={{ color: '#A0704A' }}>{formatFullDate(product.created_at)}</p>
        </div>

        {/* 상품 설명 */}
        <div className="px-4 py-5">
          <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#5C3010' }}>
            {product.description ?? '상품 설명이 없습니다.'}
          </p>
        </div>
      </div>

      {/* 하단 바 */}
      <div className="fixed bottom-0 left-0 right-0 z-10" style={{ background: '#FFF6E8', borderTop: '1px solid #FFE4BA' }}>
        <div className="max-w-screen-sm mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <p className="text-lg font-bold" style={{ color: isSold ? '#C4A882' : '#C94E00' }}>
            {formatPrice(product.price)}
          </p>
          {isSold ? (
            <div
              className="flex-1 max-w-xs py-3 rounded-xl font-bold text-sm text-center"
              style={{ background: '#D4B8A0', color: '#fff', opacity: 0.6 }}
            >
              판매 완료된 상품입니다
            </div>
          ) : (
            <Link
              href={`/products/${id}/payment`}
              className="flex-1 max-w-xs py-3 rounded-xl font-bold text-sm text-center"
              style={{ background: '#C94E00', color: '#fff' }}
            >
              구매하기
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
