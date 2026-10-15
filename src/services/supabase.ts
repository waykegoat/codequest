import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export const DEFAULT_SUPABASE_URL = 'https://bispxvxirfjeuxxgesai.supabase.co'
export const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_anqw2VwRtZs6Xrm3xfqPpw_VflYQUAR'

const STORAGE_URL_KEY = 'codequest:supabase_url'
const STORAGE_ANON_KEY = 'codequest:supabase_anon_key'

let cachedClient: SupabaseClient | null = null

export function getSupabaseConfig(): { url: string; anonKey: string } {
  const isTest = import.meta.env.MODE === 'test'

  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim()
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()

  const localUrl = (typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_URL_KEY) || '' : '').trim()
  const localKey = (typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_ANON_KEY) || '' : '').trim()

  // During automated unit tests, avoid sending real HTTP requests to the live Supabase project
  if (isTest && !localUrl) {
    return { url: '', anonKey: '' }
  }

  return {
    url: localUrl || envUrl || DEFAULT_SUPABASE_URL,
    anonKey: localKey || envKey || DEFAULT_SUPABASE_ANON_KEY,
  }
}

export function isCloudConfigured(): boolean {
  const { url, anonKey } = getSupabaseConfig()
  return Boolean(url && anonKey && url.startsWith('http'))
}

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient

  const { url, anonKey } = getSupabaseConfig()
  if (!url || !anonKey || !url.startsWith('http')) {
    return null
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
    return cachedClient
  } catch (err) {
    console.error('Ошибка инициализации Supabase:', err)
    return null
  }
}

export function setSupabaseConfig(url: string, anonKey: string): void {
  const cleanUrl = url.trim()
  const cleanKey = anonKey.trim()
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_URL_KEY, cleanUrl)
    localStorage.setItem(STORAGE_ANON_KEY, cleanKey)
  }
  cachedClient = null
}

export function clearSupabaseConfig(): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(STORAGE_URL_KEY)
    localStorage.removeItem(STORAGE_ANON_KEY)
  }
  cachedClient = null
}
