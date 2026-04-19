import { Minus, Plus, Trash2 } from 'lucide-react'
import { SectionHeading } from '../components/section-heading'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { useStore } from '../context/store-context'

export function CartPage() {
  const {
    cartItems,
    formattedShipping,
    formattedSubtotal,
    formattedTax,
    formattedTotal,
    totalValue,
    updateCartQuantity,
    removeFromCart,
  } = useStore()

  return (
    <section className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] xl:gap-10">
      <div className="space-y-6">
        <SectionHeading
          align="stacked"
          eyebrow="Your cart"
          title="Review, adjust, and keep your selections cached between visits."
        />

        {cartItems.length === 0 ? (
          <Card className="rounded-[1.5rem] border-border/70 bg-card/85 shadow-none">
            <CardContent className="space-y-3 p-6">
              <h3 className="font-serif text-2xl leading-none tracking-tight">Your cart is empty</h3>
              <p className="text-sm leading-6 text-muted-foreground">
                Add a few Northstar Market pieces from the shop or search page and they&apos;ll stay
                cached here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <Card
                key={item.id}
                className="rounded-[1.5rem] border-border/70 bg-card/85 shadow-none"
              >
                <CardContent className="flex flex-col gap-5 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{item.category}</p>
                      <h3 className="mt-1 font-serif text-2xl leading-none tracking-tight">
                        {item.name}
                      </h3>
                    </div>
                    <p className="text-lg font-semibold tracking-tight text-foreground">
                      {item.price}
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        className="rounded-full"
                        size="icon"
                        variant="outline"
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="size-4" />
                      </Button>
                      <span className="min-w-10 text-center text-sm font-medium">{item.quantity}</span>
                      <Button
                        className="rounded-full"
                        size="icon"
                        variant="outline"
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        Line total: ${item.lineTotal}
                      </span>
                      <Button
                        className="rounded-full"
                        size="icon"
                        variant="outline"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Card className="rounded-[1.75rem] border-border/70 bg-card/85 shadow-none">
        <CardContent className="space-y-5 p-6 sm:p-8">
          <h3 className="font-serif text-3xl leading-none tracking-tight">Order summary</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{formattedSubtotal}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span>{formattedShipping}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Estimated tax</span>
              <span>{formattedTax}</span>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="font-medium">Total</span>
            <span className="text-xl font-semibold tracking-tight">{formattedTotal}</span>
          </div>
          <Button className="h-12 w-full rounded-full" disabled={totalValue === 0}>
            Continue to checkout
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}
