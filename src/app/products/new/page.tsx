'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

type FormData = {
  title: string
  price: string
  description: string
  image_url: string
  seller_name: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

export default function NewProductPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [form, setForm] = useState<FormData>({
    title: '',
    price: '',
    description: '',
    image_url: '',
    seller_name: '',
  })

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.replace('/login'); return }
      setUser(user)
      const name = user.user_metadata?.full_name || user.user_metadata?.name || ''
      setForm(prev => ({ ...prev, seller_name: name }))
    })
  }, [router])
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  function getRawPrice() {
    return form.price.replace(/,/g, '')
  }

  function validate(): FormErrors {
    const e: FormErrors = {}
    if (!form.title.trim()) e.title = '상품명을 입력해주세요.'
    const rawPrice = getRawPrice()
    if (!rawPrice) e.price = '가격을 입력해주세요.'
    else if (isNaN(Number(rawPrice)) || Number(rawPrice) < 0) e.price = '올바른 가격을 입력해주세요.'
    if (!form.seller_name.trim()) e.seller_name = '판매자 이름을 입력해주세요.'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)
    setServerError('')

    const supabase = createClient()
    const { error } = await supabase.from('products').insert({
      title: form.title.trim(),
      price: Number(getRawPrice()),
      description: form.description.trim() || null,
      image_url: form.image_url.trim() || null,
      seller_name: form.seller_name.trim(),
      user_id: user?.id,
    })

    setLoading(false)

    if (error) {
      setServerError(`저장 중 오류가 발생했습니다: ${error.message}`)
      return
    }

    router.push('/')
    router.refresh()
  }

  function handleChange(field: keyof FormData, value: string) {
    if (field === 'price') {
      const digits = value.replace(/[^0-9]/g, '')
      const formatted = digits ? Number(digits).toLocaleString('ko-KR') : ''
      setForm(prev => ({ ...prev, price: formatted }))
    } else {
      setForm(prev => ({ ...prev, [field]: value }))
    }
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  return (
    <div className="min-h-screen" style={{ background: '#FFF6E8' }}>
      {/* 헤더 */}
      <header className="sticky top-0 z-10" style={{ background: '#5C2D0E', borderBottom: '1px solid #3D1A00' }}>
        <div className="max-w-screen-sm mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/"
            className="w-9 h-9 flex items-center justify-center rounded-full"
            style={{ color: '#FFD07B' }}
            aria-label="뒤로가기"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <h1 className="text-base font-bold" style={{ color: '#FFD07B' }}>상품 등록</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="max-w-screen-sm mx-auto px-4 py-6 flex flex-col gap-5">
        {/* 상품명 */}
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#3D1A00' }}>
            상품명 <span style={{ color: '#C94E00' }}>*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={e => handleChange('title', e.target.value)}
            placeholder="상품명을 입력하세요"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{
              background: '#fff',
              border: errors.title ? '1.5px solid #C94E00' : '1.5px solid #FFE4BA',
              color: '#3D1A00',
            }}
          />
          {errors.title && <p className="text-xs mt-1.5" style={{ color: '#C94E00' }}>{errors.title}</p>}
        </div>

        {/* 가격 */}
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#3D1A00' }}>
            가격 <span style={{ color: '#C94E00' }}>*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold" style={{ color: '#A0704A' }}>₩</span>
            <input
              type="text"
              inputMode="numeric"
              value={form.price}
              onChange={e => handleChange('price', e.target.value)}
              placeholder="0"
              className="w-full pl-8 pr-4 py-3 rounded-xl text-sm outline-none"
              style={{
                background: '#fff',
                border: errors.price ? '1.5px solid #C94E00' : '1.5px solid #FFE4BA',
                color: '#3D1A00',
              }}
            />
          </div>
          {errors.price && <p className="text-xs mt-1.5" style={{ color: '#C94E00' }}>{errors.price}</p>}
        </div>

        {/* 상품 설명 */}
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#3D1A00' }}>
            상품 설명
          </label>
          <textarea
            value={form.description}
            onChange={e => handleChange('description', e.target.value)}
            placeholder="상품 설명을 입력하세요 (선택)"
            rows={5}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
            style={{
              background: '#fff',
              border: '1.5px solid #FFE4BA',
              color: '#3D1A00',
            }}
          />
        </div>

        {/* 이미지 URL */}
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#3D1A00' }}>
            이미지 URL
          </label>
          <input
            type="url"
            value={form.image_url}
            onChange={e => handleChange('image_url', e.target.value)}
            placeholder="https://... (선택)"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{
              background: '#fff',
              border: '1.5px solid #FFE4BA',
              color: '#3D1A00',
            }}
          />
        </div>

        {/* 판매자 이름 */}
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: '#3D1A00' }}>
            판매자 이름 <span style={{ color: '#C94E00' }}>*</span>
          </label>
          <input
            type="text"
            value={form.seller_name}
            onChange={e => handleChange('seller_name', e.target.value)}
            placeholder="이름을 입력하세요"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{
              background: '#fff',
              border: errors.seller_name ? '1.5px solid #C94E00' : '1.5px solid #FFE4BA',
              color: '#3D1A00',
            }}
          />
          {errors.seller_name && <p className="text-xs mt-1.5" style={{ color: '#C94E00' }}>{errors.seller_name}</p>}
        </div>

        {/* 서버 에러 */}
        {serverError && (
          <p className="text-sm text-center py-2 rounded-lg" style={{ background: '#FFE4BA', color: '#C94E00' }}>
            {serverError}
          </p>
        )}

        {/* 버튼 */}
        <div className="flex gap-3 pt-2">
          <Link
            href="/"
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-center"
            style={{ background: '#FFE4BA', color: '#7C3D00' }}
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 rounded-xl text-sm font-semibold"
            style={{
              background: loading ? '#D4B8A0' : '#C94E00',
              color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? '저장 중...' : '등록'}
          </button>
        </div>
      </form>
    </div>
  )
}
