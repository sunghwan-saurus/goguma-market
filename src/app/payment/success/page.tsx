import { redirect } from 'next/navigation'
import Link from 'next/link'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

type PaymentResult = {
  paymentKey: string
  orderId: string
  orderName: string
  status: string
  approvedAt: string
  totalAmount: number
  method: string
}

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ paymentKey?: string; orderId?: string; amount?: string }>
}) {
  const { paymentKey, orderId, amount } = await searchParams

  if (!paymentKey || !orderId || !amount) redirect('/')

  // 서버에서 결제 확인
  const secretKey = process.env.TOSS_SECRET_KEY!
  const encoded = Buffer.from(`${secretKey}:`).toString('base64')

  const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${encoded}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
    cache: 'no-store',
  })

  const payment: PaymentResult = await response.json()

  if (!response.ok) redirect(`/payment/fail?message=${encodeURIComponent((payment as { message?: string }).message ?? '결제 확인 실패')}`)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: '#FFF6E8' }}>
      <div className="w-full max-w-sm rounded-2xl p-8 flex flex-col gap-5" style={{ background: '#fff', border: '1.5px solid #FFE4BA' }}>
        {/* 완료 아이콘 */}
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
            style={{ background: '#FFF0D6' }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C94E00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold" style={{ color: '#3D1A00' }}>결제 완료</h1>
          <p className="text-sm mt-1" style={{ color: '#A0704A' }}>결제가 성공적으로 완료됐어요</p>
        </div>

        {/* 결제 정보 */}
        <div className="flex flex-col gap-3 py-4" style={{ borderTop: '1px solid #FFE4BA', borderBottom: '1px solid #FFE4BA' }}>
          <Row label="주문 상품" value={payment.orderName} />
          <Row label="주문 번호" value={payment.orderId} small />
          <Row label="결제 수단" value={payment.method} />
          <Row label="결제 금액" value={`₩${payment.totalAmount.toLocaleString('ko-KR')}`} highlight />
          <Row label="승인 일시" value={formatDate(payment.approvedAt)} small />
        </div>

        {/* 버튼 */}
        <div className="flex flex-col gap-2">
          <Link
            href="/"
            className="w-full py-3 rounded-xl text-sm font-bold text-center"
            style={{ background: '#C94E00', color: '#fff' }}
          >
            🍠 메인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, small, highlight }: { label: string; value: string; small?: boolean; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-xs shrink-0" style={{ color: '#A0704A' }}>{label}</span>
      <span
        className={`text-right ${small ? 'text-xs' : 'text-sm'} ${highlight ? 'font-bold' : 'font-medium'}`}
        style={{ color: highlight ? '#C94E00' : '#3D1A00' }}
      >
        {value}
      </span>
    </div>
  )
}
