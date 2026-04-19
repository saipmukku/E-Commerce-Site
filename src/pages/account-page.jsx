import { useEffect, useState } from 'react'
import { SectionHeading } from '../components/section-heading'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { useStore } from '../context/store-context'

export function AccountPage() {
  const {
    account,
    authError,
    authReady,
    isRecoveringPassword,
    isSupabaseConfigured,
    login,
    logout,
    requestPasswordReset,
    signUp,
    updatePassword,
  } = useStore()
  const [email, setEmail] = useState(account.email)
  const [password, setPassword] = useState('')
  const [keepSignedIn, setKeepSignedIn] = useState(account.keepSignedIn)
  const [mode, setMode] = useState('login')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    setEmail(account.email)
    setKeepSignedIn(account.keepSignedIn)
  }, [account.email, account.keepSignedIn])

  useEffect(() => {
    if (isRecoveringPassword) {
      setMode('recovery')
      setPassword('')
      setStatusMessage('Choose a new password to finish resetting your account.')
    }
  }, [isRecoveringPassword])

  function isEmailValid(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setIsSubmitting(true)
      setStatusMessage('')

      if (!isEmailValid(email) && mode !== 'recovery') {
        throw new Error('Enter a valid email address.')
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long.')
      }

      if (mode === 'recovery') {
        await updatePassword(password)
        setStatusMessage('Your password has been updated. You can sign in now.')
        setMode('login')
        setPassword('')
        return
      }

      if (mode === 'signup') {
        const result = await signUp({ email, password, keepSignedIn })

        setStatusMessage(
          result.needsEmailConfirmation
            ? 'Account created. Check your email to verify your address before signing in.'
            : 'Account created and signed in.',
        )
      } else {
        await login({ email, password, keepSignedIn })
        setStatusMessage('Signed in successfully.')
      }

      setPassword('')
    } catch (error) {
      setStatusMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleLogout() {
    try {
      setIsLoggingOut(true)
      setStatusMessage('')
      await logout()
    } catch (error) {
      setStatusMessage(error.message)
    } finally {
      setIsLoggingOut(false)
    }
  }

  async function handlePasswordReset() {
    try {
      setStatusMessage('')

      if (!isEmailValid(email)) {
        throw new Error('Enter your email address first so we know where to send the reset link.')
      }

      await requestPasswordReset(email)
      setStatusMessage('If an account exists for that email, a reset link has been sent.')
    } catch (error) {
      setStatusMessage(error.message)
    }
  }

  return (
    <section className="grid gap-8 xl:grid-cols-[minmax(320px,0.85fr)_minmax(0,1.15fr)] xl:gap-10">
      <SectionHeading
        align="stacked"
        eyebrow="Your account"
        title="Sign in to track orders, save favorites, and check out faster."
        copy="Create an account or sign in to keep your shopping details ready whenever you come back."
      />

      <Card className="rounded-[1.75rem] border-border/70 bg-card/85 shadow-none">
        <CardContent className="space-y-6 p-6 sm:p-8">
          {account.isAuthenticated ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <h3 className="font-serif text-3xl leading-none tracking-tight">
                  Welcome, {account.name}
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  Signed in as {account.email}. Your account details are ready whenever you need
                  them.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-border/70 bg-background/70 p-5 text-sm text-muted-foreground">
                Keep signed in: {account.keepSignedIn ? 'Enabled' : 'Disabled'}
              </div>
              {statusMessage || authError ? (
                <div className="rounded-[1.25rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {authError || statusMessage}
                </div>
              ) : null}
              <Button
                className="h-12 w-full rounded-full"
                disabled={isLoggingOut}
                onClick={handleLogout}
                variant="outline"
              >
                {isLoggingOut ? 'Logging out...' : 'Log out'}
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <h3 className="font-serif text-3xl leading-none tracking-tight">
                  {mode === 'recovery' ? 'Reset your password' : 'Welcome back'}
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  {mode === 'recovery'
                    ? 'Choose a new password to secure your account and get back to shopping.'
                    : 'Sign in or create an account to manage your cart, saved items, and delivery details.'}
                </p>
              </div>

              {!isSupabaseConfigured ? (
                <div className="rounded-[1.25rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  Account access is temporarily unavailable. Please try again later.
                </div>
              ) : null}

              {mode !== 'recovery' ? (
                <div className="grid grid-cols-2 gap-2 rounded-full bg-background/80 p-1">
                  <button
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      mode === 'login'
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    type="button"
                    onClick={() => {
                      setMode('login')
                      setStatusMessage('')
                    }}
                  >
                    Log in
                  </button>
                  <button
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      mode === 'signup'
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    type="button"
                    onClick={() => {
                      setMode('signup')
                      setStatusMessage('')
                    }}
                  >
                    Create account
                  </button>
                </div>
              ) : null}

              <form className="space-y-4" onSubmit={handleSubmit}>
                {mode !== 'recovery' ? (
                  <Input
                    className="h-12 rounded-full border-border/80 bg-background/80 px-5"
                    placeholder="Email address"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                ) : null}
                <Input
                  className="h-12 rounded-full border-border/80 bg-background/80 px-5"
                  placeholder={mode === 'recovery' ? 'New password' : 'Password'}
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
                  {mode !== 'recovery' ? (
                    <label className="flex items-center gap-2">
                      <input
                        checked={keepSignedIn}
                        className="size-4 rounded border-border"
                        type="checkbox"
                        onChange={(event) => setKeepSignedIn(event.target.checked)}
                      />
                      Keep me signed in
                    </label>
                  ) : (
                    <span>Use at least 6 characters.</span>
                  )}
                  <span>{authReady ? 'Ready' : 'Loading account...'}</span>
                </div>
                {statusMessage || authError ? (
                  <div
                    className={`rounded-[1.25rem] px-4 py-3 text-sm ${
                      statusMessage && !authError
                        ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border border-red-200 bg-red-50 text-red-700'
                    }`}
                  >
                    {authError || statusMessage}
                  </div>
                ) : null}
                <Button
                  className="h-12 w-full rounded-full"
                  disabled={!isSupabaseConfigured || !authReady || isSubmitting}
                  type="submit"
                >
                  {isSubmitting
                    ? mode === 'recovery'
                      ? 'Saving password...'
                      : mode === 'signup'
                      ? 'Creating account...'
                      : 'Signing in...'
                    : mode === 'recovery'
                      ? 'Save new password'
                      : mode === 'signup'
                      ? 'Create account'
                      : 'Log in'}
                </Button>
                {mode === 'login' ? (
                  <button
                    className="w-full text-sm font-medium text-primary"
                    type="button"
                    onClick={handlePasswordReset}
                  >
                    Forgot password?
                  </button>
                ) : null}
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
