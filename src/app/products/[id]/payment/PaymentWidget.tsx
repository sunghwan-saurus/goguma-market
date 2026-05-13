'use client'

import { useState } from 'react'
import Script from 'next/script'
import { useRouter } from 'next/navigation'

type Props = {
  productTitle: string
  price: number
  customerName?: string
  customerEmail?: string
}

declare global {
  interface Window {
    TossPayments: (clientKey: string) => {
      requestPayment: (method: string, options: Record<string, unknown>) => Promise<void>
    }
  }
}

export default function TossPaymentWidget({ productTitle, price, customerName, customerEmail }: Props) {
  const router = useRouter()
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [scriptReady, setScriptReady] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function handlePay() {
    if (!scriptReady) {
      setErrorMsg('결제 모듈이 아직 로딩 중입니다. 잠시 후 다시 시도해주세요.')
      return
    }
    if (!agreed) {
      setErrorMsg('결제 서비스 이용약관에 동의해주세요.')
      return
    }

    setErrorMsg(null)
    setLoading(true)

    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

    try {
      const toss = window.TossPayments(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!)
      await toss.requestPayment('카드', {
        amount: price,
        orderId,
        orderName: productTitle,
        customerName: customerName ?? '구매자',
        customerEmail,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      })
    } catch (e) {
      const err = e as { code?: string; message?: string }
      if (err?.code !== 'USER_CANCEL') {
        setErrorMsg(err?.message ?? '결제 중 오류가 발생했습니다.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Script
        src="https://js.tosspayments.com/v1/payment"
        onReady={() => setScriptReady(true)}
      />

      <div className="max-w-screen-sm mx-auto">
        {/* 결제 수단 */}
        <div className="px-4 py-5" style={{ borderBottom: '1px solid #FFE4BA' }}>
          <p className="text-xs font-semibold mb-3" style={{ color: '#A0704A' }}>결제 수단</p>
          <div
            className="flex items-center gap-3 px-4 py-4 rounded-xl border-2"
            style={{ borderColor: '#C94E00', background: '#FFF0D6' }}
          >
            <span className="text-2xl">💳</span>
            <div>
              <p className="font-bold text-sm" style={{ color: '#C94E00' }}>토스페이먼츠</p>
              <p className="text-xs mt-0.5" style={{ color: '#A0704A' }}>신용/체크카드 결제</p>
            </div>
          </div>
        </div>

        {/* 결제 금액 */}
        <div className="px-4 py-4 flex justify-between items-center" style={{ borderBottom: '1px solid #FFE4BA' }}>
          <span className="text-sm font-medium" style={{ color: '#A0704A' }}>최종 결제 금액</span>
          <span className="text-lg font-bold" style={{ color: '#C94E00' }}>
            ₩{price.toLocaleString('ko-KR')}
          </span>
        </div>

        {/* 약관 동의 */}
        <div className="px-4 py-4" style={{ borderBottom: '1px solid #FFE4BA' }}>
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-orange-700 shrink-0"
            />
            <div>
              <p className="text-sm font-medium" style={{ color: '#3D1A00' }}>
                결제 서비스 이용약관 전체 동의
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#A0704A' }}>
                결제 서비스 이용약관, 개인정보 수집·이용 동의, 제3자 제공 동의 포함
              </p>
            </div>
          </label>
        </div>

        {/* 버튼 */}
        <div className="px-4 py-4 flex flex-col gap-2">
          {errorMsg && (
            <p className="text-sm text-center font-medium" style={{ color: '#C94E00' }}>
              {errorMsg}
            </p>
          )}
          <button
            onClick={handlePay}
            disabled={loading || !scriptReady}
            className="w-full py-4 rounded-xl font-bold text-base"
            style={{
              background: loading || !scriptReady ? '#D4B8A0' : '#C94E00',
              color: '#fff',
              cursor: loading || !scriptReady ? 'not-allowed' : 'pointer',
            }}
          >
            {!scriptReady ? '로딩 중...' : loading ? '결제 진행 중...' : `₩${price.toLocaleString('ko-KR')} 결제하기`}
          </button>
          <button
            onClick={() => router.back()}
            className="w-full py-3 rounded-xl text-sm font-semibold"
            style={{ background: '#FFE4BA', color: '#7C3D00' }}
          >
            취소
          </button>
        </div>
      </div>
    </>
  )
}
