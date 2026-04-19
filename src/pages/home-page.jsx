import { ArrowRight, Heart, Package, ShieldCheck, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SectionHeading } from '../components/section-heading'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { useStore } from '../context/store-context'

const benefits = [
  {
    icon: Truck,
    label: 'Free shipping over $75',
  },
  {
    icon: ShieldCheck,
    label: '30-day returns and exchanges',
  },
  {
    icon: Package,
    label: 'Independent maker collections',
  },
]

export function HomePage() {
  const { products, addToCart, cartCount } = useStore()
  const featuredProducts = products.slice(0, 3)

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 px-5 py-8 shadow-[0_24px_80px_rgba(92,62,35,0.12)] backdrop-blur sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,218,170,0.55),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.95),rgba(250,240,227,0.8))]" />
        <div className="relative grid gap-8 pb-4 pt-8 xl:grid-cols-[minmax(0,1.45fr)_minmax(420px,0.85fr)] xl:items-end xl:gap-12 2xl:grid-cols-[minmax(0,1.55fr)_minmax(460px,0.8fr)]">
          <div className="space-y-7">
            <Badge variant="secondary" className="rounded-full px-4 py-1.5">
              Rooted in thoughtful living
            </Badge>
            <div className="space-y-5">
              <h1 className="max-w-4xl font-serif text-5xl leading-none tracking-tight text-foreground sm:text-6xl lg:text-7xl 2xl:max-w-5xl 2xl:text-[5.5rem]">
                A softer, slower kind of modern general store.
              </h1>
              <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg 2xl:max-w-4xl">
                Northstar Market is a curated lifestyle shop built around everyday usefulness.
                We bring together small-batch home goods, easy wardrobe staples, and giftable
                pieces chosen to make homes feel warmer, mornings feel calmer, and daily routines
                feel more intentional.
              </p>
              <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg 2xl:max-w-4xl">
                Our collections are guided by natural materials, understated color, and practical
                beauty. Whether someone is refreshing a kitchen shelf, finding a favorite sweater,
                or picking up a host gift, Northstar Market is meant to feel dependable, welcoming,
                and quietly elevated.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="rounded-full px-6" size="lg">
                <Link to="/shop">
                  Browse the shop
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild className="rounded-full px-6" size="lg" variant="outline">
                <Link to="/account">Sign in to your account</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {cartCount > 0
                ? `You currently have ${cartCount} item${cartCount === 1 ? '' : 's'} saved in your cart.`
                : 'Your cart is empty and ready for your first pick.'}
            </p>
          </div>

          <Card className="border-primary/10 bg-card/90 shadow-none">
            <CardContent className="space-y-6 p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge className="rounded-full px-3 py-1">Community favorite</Badge>
                  <h2 className="mt-4 font-serif text-3xl leading-none tracking-tight">
                    Studio Setup Bundle
                  </h2>
                </div>
                <Heart className="mt-1 size-5 text-primary" />
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                A bundle shaped around Northstar Market&apos;s approach: tactile materials, calm
                colors, and practical pieces that transition easily from weekday routines to
                slower weekend hosting.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Card className="rounded-2xl border-border/70 bg-background/80 shadow-none">
                  <CardContent className="p-4">
                    <p className="text-2xl font-semibold tracking-tight">24h</p>
                    <p className="text-sm text-muted-foreground">dispatch</p>
                  </CardContent>
                </Card>
                <Card className="rounded-2xl border-border/70 bg-background/80 shadow-none">
                  <CardContent className="p-4">
                    <p className="text-2xl font-semibold tracking-tight">4.9/5</p>
                    <p className="text-sm text-muted-foreground">customer rating</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3 xl:gap-5">
        {benefits.map(({ icon: Icon, label }) => (
          <Card key={label} className="rounded-[1.5rem] border-border/70 bg-card/75 shadow-none">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <p className="text-sm font-medium text-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="pt-14">
        <SectionHeading
          eyebrow="From the market floor"
          title="Pieces selected for homes that value ease, warmth, and longevity."
          copy="Northstar Market favors useful designs that settle naturally into daily life instead of chasing short-lived trends."
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-7">
          {featuredProducts.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden rounded-[1.75rem] border-border/70 bg-card/85 pt-0 shadow-[0_16px_40px_rgba(92,62,35,0.08)]"
            >
              <div aria-hidden="true" className={`h-64 w-full bg-gradient-to-br ${product.accent}`} />
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center justify-between gap-4">
                  <Badge className="rounded-full px-3 py-1">Featured</Badge>
                  <span className="text-sm font-medium text-muted-foreground">{product.category}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-2xl leading-none tracking-tight">{product.name}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {product.description}
                    </p>
                  </div>
                  <span className="text-lg font-semibold tracking-tight text-foreground">
                    {product.price}
                  </span>
                </div>
                <Button className="w-full rounded-full" onClick={() => addToCart(product.id)}>
                  Add to cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-8 pt-20 xl:grid-cols-[minmax(320px,0.85fr)_minmax(0,1.15fr)] xl:gap-10">
        <SectionHeading
          align="stacked"
          eyebrow="About the business"
          title="A neighborhood-inspired shop rooted in warmth, utility, and timeless design."
        />
        <Card className="rounded-[1.75rem] border-border/70 bg-card/85 shadow-none">
          <CardContent className="space-y-5 p-6 sm:p-8">
            <p className="text-base leading-7 text-muted-foreground">
              Northstar Market was built for customers who want their everyday pieces to feel special
              without becoming precious. We look for products that are tactile, durable, and easy to
              live with, from kitchen counter staples to soft layering essentials and small host gifts.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              The business centers on curated collections rather than endless inventory. That means
              every item is chosen to work well together, making it easier for shoppers to discover
              combinations that feel collected, calm, and genuinely useful.
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              We want Northstar Market to feel like a trusted local shop translated online: personal,
              easy to navigate, and full of pieces that quietly improve the rhythm of home.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
