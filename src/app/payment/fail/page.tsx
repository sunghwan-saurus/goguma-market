import Link from 'next/link'
import GoBackButton from '@/components/GoBackButton'

export default async function PaymentFailPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; code?: string }>
}) {
  const { message, code } = await searchParams

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: '#FFF6E8' }}>
      <div className="w-full max-w-sm rounded-2xl p-8 flex flex-col gap-5 text-center" style={{ background: '#fff', border: '1.5px solid #FFE4BA' }}>
        <div>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
            style={{ background: '#FFF0D6' }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C94E00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
          <h1 className="text-xl font-bold" style={{ color: '#3D1A00' }}>결제 실패</h1>
          <p className="text-sm mt-2" style={{ color: '#A0704A' }}>
            {message ?? '결제 중 오류가 발생했어요.'}
          </p>
          {code && (
            <p className="text-xs mt-1" style={{ color: '#B8A090' }}>오류 코드: {code}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <GoBackButton
            label="다시 시도하기"
            className="w-full py-3 rounded-xl text-sm font-bold"
            style={{ background: '#C94E00', color: '#fff' }}
          />
          <Link
            href="/"
            className="w-full py-3 rounded-xl text-sm font-semibold text-center"
            style={{ background: '#FFE4BA', color: '#7C3D00' }}
          >
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
