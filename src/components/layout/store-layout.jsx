import { Search, ShoppingBag, User } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useStore } from '../../context/store-context'
import { Button } from '../ui/button'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
]

function navLinkClassName({ isActive }) {
  return [
    'rounded-full px-3 py-2 text-sm font-medium transition-colors',
    isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground',
  ].join(' ')
}

export function StoreLayout() {
  const { account, cartCount } = useStore()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-[min(1720px,100vw)] flex-col px-3 py-3 sm:px-5 lg:px-8 xl:px-10 2xl:px-12">
        <header className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 px-5 py-5 shadow-[0_24px_80px_rgba(92,62,35,0.12)] backdrop-blur sm:px-8 lg:px-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,218,170,0.55),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.95),rgba(250,240,227,0.8))]" />
          <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-foreground text-sm font-bold text-background">
                B
              </div>
              <div>
                <NavLink className="font-semibold tracking-tight" to="/">
                  Brew and Bundle
                </NavLink>
                <p className="text-sm text-muted-foreground">
                  {account.isAuthenticated
                    ? `Welcome back, ${account.name}`
                    : 'Thoughtful goods for everyday rituals'}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:gap-6">
              <nav className="flex flex-wrap items-center gap-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    className={navLinkClassName}
                    end={item.to === '/'}
                    to={item.to}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              <div className="flex flex-wrap gap-2">
                <Button asChild className="rounded-full" size="default" variant="outline">
                  <NavLink to="/search">
                    <Search className="size-4" />
                    Search
                  </NavLink>
                </Button>
                <Button asChild className="rounded-full" size="default" variant="outline">
                  <NavLink to="/account">
                    <User className="size-4" />
                    Account
                  </NavLink>
                </Button>
                <Button asChild className="rounded-full" size="default">
                  <NavLink to="/cart">
                    <ShoppingBag className="size-4" />
                    Cart{cartCount > 0 ? ` (${cartCount})` : ''}
                  </NavLink>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 py-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
