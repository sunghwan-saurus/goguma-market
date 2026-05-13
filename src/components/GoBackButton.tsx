'use client'

import { useRouter } from 'next/navigation'

export default function GoBackButton({
  label,
  className,
  style,
}: {
  label: string
  className?: string
  style?: React.CSSProperties
}) {
  const router = useRouter()
  return (
    <button onClick={() => router.back()} className={className} style={style}>
      {label}
    </button>
  )
}
