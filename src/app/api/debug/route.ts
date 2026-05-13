import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return NextResponse.json({ error: 'env vars missing', url: !!url, key: !!key })
  }

  const supabase = createClient(url, key)
  const { data, error, count } = await supabase
    .from('products')
    .select('id, title', { count: 'exact' })
    .limit(3)

  return NextResponse.json({
    url: url.slice(0, 30),
    keyLen: key.length,
    error: error?.message ?? null,
    count,
    sample: data,
  })
}
