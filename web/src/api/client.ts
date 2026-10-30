const TOKEN_KEY = 'qs_token'

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

let onUnauthorized: () => void = () => {}
export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler
}

// Backend bazen JSON ({message} veya doğrulama için {errors:{alan:mesaj}}), bazen düz metin döner
async function readMessage(res: Response): Promise<string> {
  const text = await res.text()
  try {
    const json = JSON.parse(text) as { message?: string; error?: string; errors?: Record<string, string> }
    if (json.errors && typeof json.errors === 'object') {
      const details = Object.entries(json.errors)
        .map(([field, msg]) => `${field}: ${msg}`)
        .join('; ')
      return details ? `${json.error ?? 'Validation failed'} (${details})` : (json.error ?? text)
    }
    return json.message || json.error || text
  } catch {
    return text || `${res.status} ${res.statusText}`
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const token = tokenStore.get()
  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(`/api${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Is the gateway port-forward running?')
  }

  // Token varken 401 = oturum süresi dolmuş; token yokken (yanlış parola) çıkış yaptırma
  if (res.status === 401 && token) onUnauthorized()
  if (res.status === 403) throw new ApiError(403, 'You do not have permission to do this (ADMIN role required).')
  if (!res.ok) throw new ApiError(res.status, await readMessage(res))
  if (res.status === 204) return null as unknown as T

  const text = await res.text()
  return (text ? JSON.parse(text) : null) as T
}

export const http = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
  delete: (path: string) => request<null>('DELETE', path),
}
