const PROD_API = 'https://zhipu.wang:8443'

export function proxyImageUrl(url: string): string {
  if (!url || !url.includes('photo.yupoo.com')) return url
  const base = import.meta.env.DEV ? '' : PROD_API
  return `${base}/api/images/proxy?url=${encodeURIComponent(url)}`
}
