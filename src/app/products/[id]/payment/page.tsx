import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import BackButton from '@/components/BackButton'
import TossPaymentWidget from './PaymentWidget'

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: product }, { data: { user } }] = await Promise.all([
    supabase.from('products').select('id, title, price, status').eq('id', id).single(),
    supabase.auth.getUser(),
  ])

  if (!product) notFound()
  if (product.status === '판매완료') redirect(`/products/${id}`)
  if (!user) redirect('/login')

  const customerKey = user.id
  const customerEmail = user.email ?? undefined
  const customerName = user.user_metadata?.full_name ?? user.user_metadata?.name ?? undefined

  return (
    <div className="min-h-screen pb-8" style={{ background: '#FFF6E8' }}>
      <header className="sticky top-0 z-10" style={{ background: '#5C2D0E', borderBottom: '1px solid #3D1A00' }}>
        <div className="max-w-screen-sm mx-auto px-2 py-2 flex items-center gap-2">
          <BackButton />
          <span className="font-bold text-base" style={{ color: '#FFD07B' }}>결제하기</span>
        </div>
      </header>

      {/* 주문 요약 */}
      <div className="max-w-screen-sm mx-auto px-4 py-5" style={{ borderBottom: '1px solid #FFE4BA' }}>
        <p className="text-xs font-semibold mb-1" style={{ color: '#A0704A' }}>주문 상품</p>
        <p className="font-bold text-base" style={{ color: '#3D1A00' }}>{product.title}</p>
        <p className="text-xl font-bold mt-1" style={{ color: '#C94E00' }}>
          ₩{product.price.toLocaleString('ko-KR')}
        </p>
      </div>

      {/* 결제 위젯 */}
      <TossPaymentWidget
        productId={id}
        productTitle={product.title}
        price={product.price}
        customerEmail={customerEmail}
        customerName={customerName}
      />
    </div>
  )
}
