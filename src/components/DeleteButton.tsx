'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleDelete() {
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) {
      setError(`삭제 중 오류가 발생했습니다: ${error.message}`)
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs font-semibold px-3 py-1.5 rounded-lg shrink-0"
        style={{ background: '#7C3D00', color: '#fff' }}
      >
        삭제
      </button>

      {/* 확인 모달 */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => !loading && setOpen(false)}
        >
          <div
            className="w-full max-w-xs rounded-2xl p-6 flex flex-col gap-4"
            style={{ background: '#FFF6E8' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center">
              <p className="text-2xl mb-2">🗑️</p>
              <p className="font-bold text-base" style={{ color: '#3D1A00' }}>정말로 삭제하시겠습니까?</p>
              <p className="text-xs mt-1" style={{ color: '#A0704A' }}>삭제한 상품은 복구할 수 없어요.</p>
            </div>

            {error && (
              <p className="text-xs text-center py-1.5 rounded-lg" style={{ background: '#FFE4BA', color: '#C94E00' }}>
                {error}
              </p>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                className="flex-1 py-3 rounded-xl text-sm font-semibold"
                style={{ background: '#FFE4BA', color: '#7C3D00' }}
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 py-3 rounded-xl text-sm font-semibold"
                style={{
                  background: loading ? '#D4B8A0' : '#C94E00',
                  color: '#fff',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? '삭제 중...' : '확인'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
