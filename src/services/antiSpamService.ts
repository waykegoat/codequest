/**
 * Anti-spam and bot protection utilities for registration and auth.
 */

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  '10minutemail.com',
  'tempmail.com',
  'guerrillamail.com',
  'trashmail.com',
  'yopmail.com',
  'sharklasers.com',
  'getairmail.com',
  'temp-mail.org',
  'dispostable.com',
  'throwawaymail.com',
  'fakemailgenerator.com',
  'mytemp.email',
  'generator.email',
])

const RATE_LIMIT_KEY = 'codequest:auth_attempts:v1'
const MAX_ATTEMPTS = 5
const WINDOW_MS = 60 * 1000 // 1 minute

export function isDisposableEmail(email: string): boolean {
  if (!email || !email.includes('@')) return false
  const domain = email.split('@')[1]?.toLowerCase().trim()
  if (!domain) return false
  return DISPOSABLE_DOMAINS.has(domain)
}

export function checkClientRateLimit(): { allowed: boolean; waitSeconds?: number } {
  try {
    const raw = sessionStorage.getItem(RATE_LIMIT_KEY)
    const timestamps: number[] = raw ? JSON.parse(raw) : []
    const now = Date.now()

    // Filter timestamps within window
    const recent = timestamps.filter((t) => now - t < WINDOW_MS)

    if (recent.length >= MAX_ATTEMPTS) {
      const oldest = recent[0]
      const waitSeconds = Math.max(1, Math.ceil((oldest + WINDOW_MS - now) / 1000))
      return { allowed: false, waitSeconds }
    }

    recent.push(now)
    sessionStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recent))
    return { allowed: true }
  } catch {
    return { allowed: true }
  }
}
