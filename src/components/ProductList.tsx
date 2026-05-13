'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type Product = {
  id: string
  title: string
  price: number
  image_url: string | null
  seller_name: string
  status: string
  created_at: string
}

function formatPrice(price: number) {
  return `₩${price.toLocaleString('ko-KR')}`
}

function formatDate(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return '방금 전'
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`
  return `${Math.floor(diff / 86400)}일 전`
}

type SortOption = 'latest' | 'price_asc' | 'price_desc'
type StatusFilter = '전체' | '판매중' | '예약중' | '판매완료'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'latest', label: '최신순' },
  { value: 'price_asc', label: '낮은 가격순' },
  { value: 'price_desc', label: '높은 가격순' },
]

const STATUS_FILTERS: StatusFilter[] = ['전체', '판매중', '예약중', '판매완료']

export default function ProductList({ products }: { products: Product[] }) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortOption>('latest')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('전체')

  const filtered = (query.trim()
    ? products.filter(p => p.title.toLowerCase().includes(query.trim().toLowerCase()))
    : [...products]
  )
    .filter(p => statusFilter === '전체' || p.status === statusFilter)
    .sort((a, b) => {
      if (sort === 'price_asc') return a.price - b.price
      if (sort === 'price_desc') return b.price - a.price
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  return (
    <>
      {/* 검색창 + 정렬 */}
      <div className="max-w-screen-sm mx-auto px-4 py-3 flex gap-2">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2"
            width="18" height="18" viewBox="0 0 24 24"
            fill="none" stroke="#A0704A" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="상품명으로 검색"
            className="w-full pl-10 pr-8 py-2.5 rounded-xl text-sm outline-none"
            style={{
              background: '#fff',
              border: '1.5px solid #FFE4BA',
              color: '#3D1A00',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: '#A0704A' }}
              aria-label="검색어 지우기"
            >
              ✕
            </button>
          )}
        </div>

        {/* 정렬 드롭다운 */}
        <select
          value={sort}
          onChange={e => setSort(e.target.value as SortOption)}
          className="py-2.5 px-3 rounded-xl text-sm outline-none shrink-0"
          style={{
            background: '#fff',
            border: '1.5px solid #FFE4BA',
            color: '#3D1A00',
          }}
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* 상태 필터 버튼 */}
      <div className="max-w-screen-sm mx-auto px-4 pb-2 flex gap-2">
        {STATUS_FILTERS.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
            style={{
              background: statusFilter === s ? '#C94E00' : '#fff',
              color: statusFilter === s ? '#fff' : '#A0704A',
              border: statusFilter === s ? '1.5px solid #C94E00' : '1.5px solid #FFE4BA',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* 검색 결과 수 */}
      {query.trim() && (
        <div className="max-w-screen-sm mx-auto px-4 pb-1">
          <p className="text-xs" style={{ color: '#A0704A' }}>
            &quot;{query.trim()}&quot; 검색 결과 {filtered.length}개
          </p>
        </div>
      )}

      {/* 상품 목록 */}
      <ul className="max-w-screen-sm mx-auto">
        {filtered.length === 0 ? (
          <li className="text-center py-20" style={{ color: '#A0704A' }}>
            <p className="text-3xl mb-3">🍠</p>
            <p className="text-sm">검색 결과가 없어요.</p>
          </li>
        ) : (
          filtered.map(product => (
            <li key={product.id} style={{ borderBottom: '1px solid #FFE4BA' }}>
              <Link
                href={`/products/${product.id}`}
                className="product-item flex gap-4 px-4 py-5 transition-colors"
              >
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

                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {product.status === '예약중' && (
                        <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ background: '#7C3D00', color: '#fff' }}>
                          예약중
                        </span>
                      )}
                      {product.status === '판매완료' && (
                        <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ background: '#B8A090', color: '#fff' }}>
                          판매완료
                        </span>
                      )}
                      <span
                        className="font-bold truncate"
                        style={{
                          color: product.status === '판매완료' ? '#C4A882' : '#3D1A00',
                          textDecoration: product.status === '판매완료' ? 'line-through' : 'none',
                        }}
                      >
                        {product.title}
                      </span>
                    </div>
                    <p className="text-xs mt-1" style={{ color: '#A0704A' }}>
                      {product.seller_name} · {formatDate(product.created_at)}
                    </p>
                  </div>
                  <p className="text-sm font-bold" style={{ color: product.status === '판매완료' ? '#C4A882' : '#C94E00' }}>
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Link>
            </li>
          ))
        )}
      </ul>
    </>
  )
}
