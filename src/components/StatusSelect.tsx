'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Status = '판매중' | '예약중' | '판매완료'

const STATUS_STYLES: Record<Status, { bg: string; color: string }> = {
  판매중:  { bg: '#C94E00', color: '#fff' },
  예약중:  { bg: '#7C3D00', color: '#fff' },
  판매완료: { bg: '#B8A090', color: '#fff' },
}

export default function StatusSelect({ id, current }: { id: string; current: Status }) {
  const router = useRouter()
  const [status, setStatus] = useState<Status>(current)
  const [loading, setLoading] = useState(false)

  async function handleChange(next: Status) {
    if (next === status) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('products').update({ status: next }).eq('id', id)
    setStatus(next)
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold px-2 py-0.5 rounded" style={STATUS_STYLES[status]}>
        {status}
      </span>
      <select
        value={status}
        disabled={loading}
        onChange={e => handleChange(e.target.value as Status)}
        className="text-xs py-1 px-2 rounded-lg outline-none"
        style={{
          background: '#FFE4BA',
          color: '#7C3D00',
          border: '1.5px solid #FFD07B',
          opacity: loading ? 0.6 : 1,
        }}
      >
        <option value="판매중">판매중</option>
        <option value="예약중">예약중</option>
        <option value="판매완료">판매완료</option>
      </select>
    </div>
  )
}
