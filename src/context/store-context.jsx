import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useLocalStorage } from '../hooks/use-local-storage'
import { products as initialProducts } from '../data/products'
import {
  getAuthPersistencePreference,
  getAuthRedirectUrl,
  isSupabaseConfigured,
  setAuthPersistence,
  supabase,
} from '../lib/supabase'

const StoreContext = createContext(null)
const defaultAccount = {
  isAuthenticated: false,
  email: '',
  name: '',
  keepSignedIn: false,
}

function toCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDisplayName(email = '') {
  const derivedName = email.split('@')[0]?.replace(/[._-]/g, ' ') || 'Northstar guest'
  return derivedName.replace(/\b\w/g, (character) => character.toUpperCase())
}

function toAccount(user) {
  if (!user) {
    return {
      ...defaultAccount,
      keepSignedIn: getAuthPersistencePreference(),
    }
  }

  const metadataName = user.user_metadata?.full_name || user.user_metadata?.name

  return {
    isAuthenticated: true,
    email: user.email ?? '',
    name: metadataName || formatDisplayName(user.email),
    keepSignedIn: getAuthPersistencePreference(),
  }
}

export function StoreProvider({ children }) {
  const [cart, setCart] = useLocalStorage('northstar-cart', [])
  const [account, setAccount] = useState(defaultAccount)
  const [searchQuery, setSearchQuery] = useLocalStorage('northstar-search-query', '')
  const [searchHistory, setSearchHistory] = useLocalStorage('northstar-search-history', [])
  const [authReady, setAuthReady] = useState(!isSupabaseConfigured)
  const [authError, setAuthError] = useState('')
  const [isRecoveringPassword, setIsRecoveringPassword] = useState(false)

  const cartItems = useMemo(() => {
    return cart
      .map((entry) => {
        const product = initialProducts.find((item) => item.id === entry.productId)

        if (!product) {
          return null
        }

        return {
          ...product,
          quantity: entry.quantity,
          lineTotal: product.priceValue * entry.quantity,
        }
      })
      .filter(Boolean)
  }, [cart])

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const subtotalValue = cartItems.reduce((total, item) => total + item.lineTotal, 0)
  const shippingValue = subtotalValue > 0 ? (subtotalValue >= 75 ? 0 : 8) : 0
  const taxValue = Math.round(subtotalValue * 0.09)
  const totalValue = subtotalValue + shippingValue + taxValue

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAccount(defaultAccount)
      return
    }

    let isMounted = true

    async function hydrateAccount() {
      const { data, error } = await supabase.auth.getSession()

      if (!isMounted) {
        return
      }

      if (error) {
        setAuthError(error.message)
      } else {
        setAccount(toAccount(data.session?.user))
      }

      setAuthReady(true)
    }

    hydrateAccount()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsRecoveringPassword(event === 'PASSWORD_RECOVERY')
      setAccount(toAccount(session?.user))
      setAuthError('')
      setAuthReady(true)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  function addToCart(productId) {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.productId === productId)

      if (existingItem) {
        return currentCart.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      return [...currentCart, { productId, quantity: 1 }]
    })
  }

  function updateCartQuantity(productId, quantity) {
    if (quantity <= 0) {
      setCart((currentCart) => currentCart.filter((item) => item.productId !== productId))
      return
    }

    setCart((currentCart) =>
      currentCart.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
    )
  }

  function removeFromCart(productId) {
    setCart((currentCart) => currentCart.filter((item) => item.productId !== productId))
  }

  async function login({ email, password, keepSignedIn }) {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured yet. Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
    }

    const trimmedEmail = email.trim()
    setAuthPersistence(keepSignedIn)
    setAuthError('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    })

    if (error) {
      setAuthError(error.message)
      throw error
    }

    setAccount(toAccount(data.user))
  }

  async function signUp({ email, password, keepSignedIn }) {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured yet. Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
    }

    const trimmedEmail = email.trim()
    const displayName = formatDisplayName(trimmedEmail)
    setAuthPersistence(keepSignedIn)
    setAuthError('')

    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        emailRedirectTo: getAuthRedirectUrl('/account'),
        data: {
          full_name: displayName,
          name: displayName,
        },
      },
    })

    if (error) {
      setAuthError(error.message)
      throw error
    }

    setAccount(toAccount(data.user))
    return {
      needsEmailConfirmation: !data.session,
    }
  }

  async function requestPasswordReset(email) {
    if (!isSupabaseConfigured) {
      throw new Error('Account access is temporarily unavailable. Please try again later.')
    }

    setAuthError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: getAuthRedirectUrl('/account'),
    })

    if (error) {
      setAuthError(error.message)
      throw error
    }
  }

  async function updatePassword(password) {
    if (!isSupabaseConfigured) {
      throw new Error('Account access is temporarily unavailable. Please try again later.')
    }

    setAuthError('')

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      setAuthError(error.message)
      throw error
    }

    setIsRecoveringPassword(false)
  }

  async function logout() {
    if (!isSupabaseConfigured) {
      setAccount(defaultAccount)
      return
    }

    const { error } = await supabase.auth.signOut()

    if (error) {
      setAuthError(error.message)
      throw error
    }

    setAuthError('')
    setAccount({
      ...defaultAccount,
      keepSignedIn: getAuthPersistencePreference(),
    })
  }

  function commitSearch(query) {
    const normalizedQuery = query.trim()
    setSearchQuery(normalizedQuery)

    if (!normalizedQuery) {
      return
    }

    setSearchHistory((currentHistory) => {
      const nextHistory = [
        normalizedQuery,
        ...currentHistory.filter((entry) => entry.toLowerCase() !== normalizedQuery.toLowerCase()),
      ]

      return nextHistory.slice(0, 6)
    })
  }

  const value = {
    products: initialProducts,
    cartItems,
    cartCount,
    subtotalValue,
    shippingValue,
    taxValue,
    totalValue,
    formattedSubtotal: toCurrency(subtotalValue),
    formattedShipping: shippingValue === 0 && subtotalValue > 0 ? 'Free' : toCurrency(shippingValue),
    formattedTax: toCurrency(taxValue),
    formattedTotal: toCurrency(totalValue),
    account,
    authReady,
    authError,
    isSupabaseConfigured,
    isRecoveringPassword,
    searchQuery,
    searchHistory,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    login,
    signUp,
    logout,
    requestPasswordReset,
    updatePassword,
    commitSearch,
    setSearchQuery,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)

  if (!context) {
    throw new Error('useStore must be used within a StoreProvider')
  }

  return context
}
