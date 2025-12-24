export function withProjectId(params?: Record<string, string | number | undefined>) {
  if (process.env.NODE_ENV !== 'development') return ''

  const search = new URLSearchParams()

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) search.set(key, String(value))
    })
  }

  search.set('pid', '694900375118e605d8b89551')

  return `?${search.toString()}`
}