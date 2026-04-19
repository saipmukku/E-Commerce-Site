import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
const AUTH_STORAGE_KEY = 'northstar-supabase-auth'
const AUTH_PREFERENCE_KEY = 'northstar-auth-persistence'

export function getAuthRedirectUrl(path = '/account') {
  if (typeof window === 'undefined') {
    return undefined
  }

  return new URL(path, window.location.origin).toString()
}

function getActiveStorage() {
  if (typeof window === 'undefined') {
    return null
  }

  const preferredMode = window.localStorage.getItem(AUTH_PREFERENCE_KEY)
  return preferredMode === 'local' ? window.localStorage : window.sessionStorage
}

function clearAuthStorage() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY)
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY)
}

export function setAuthPersistence(keepSignedIn) {
  if (typeof window === 'undefined') {
    return
  }

  const nextMode = keepSignedIn ? 'local' : 'session'
  window.localStorage.setItem(AUTH_PREFERENCE_KEY, nextMode)
  clearAuthStorage()
}

export function getAuthPersistencePreference() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.localStorage.getItem(AUTH_PREFERENCE_KEY) === 'local'
}

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

const browserStorage = {
  getItem(key) {
    if (typeof window === 'undefined') {
      return null
    }

    const localValue = window.localStorage.getItem(key)

    if (localValue) {
      return localValue
    }

    return window.sessionStorage.getItem(key)
  },
  setItem(key, value) {
    const storage = getActiveStorage()
    if (!storage) {
      return
    }

    window.localStorage.removeItem(key)
    window.sessionStorage.removeItem(key)
    storage.setItem(key, value)
  },
  removeItem(key) {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.removeItem(key)
    window.sessionStorage.removeItem(key)
  },
}

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
        storage: browserStorage,
        storageKey: AUTH_STORAGE_KEY,
      },
    })
  : null
