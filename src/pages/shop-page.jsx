import { useMemo, useState } from 'react'
import { SectionHeading } from '../components/section-heading'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { useStore } from '../context/store-context'

export function ShopPage() {
  const { products, addToCart } = useStore()
  const [activeCategory, setActiveCategory] = useState('All')
  const categories = useMemo(
    () => ['All', ...new Set(products.map((product) => product.category))],
    [products],
  )
  const visibleProducts =
    activeCategory === 'All'
      ? products
      : products.filter((product) => product.category === activeCategory)

  return (
    <section className="space-y-8">
      <SectionHeading
        eyebrow="Shop catalog"
        title="Browse the Northstar Market collection."
        copy="Browse by category, add products to your cart, and use the featured tags to spot current standouts."
      />

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            className="rounded-full"
            onClick={() => setActiveCategory(category)}
            variant={activeCategory === category ? 'default' : 'outline'}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-7">
        {visibleProducts.map((product) => (
          <Card
            key={product.id}
            className="overflow-hidden rounded-[1.75rem] border-border/70 bg-card/85 pt-0 shadow-[0_16px_40px_rgba(92,62,35,0.08)]"
          >
            <div className="relative">
              <div aria-hidden="true" className={`h-64 w-full bg-gradient-to-br ${product.accent}`} />
              {product.featured ? (
                <Badge className="absolute left-4 top-4 rounded-full px-3 py-1">Featured</Badge>
              ) : null}
            </div>
            <CardContent className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">{product.category}</p>
                  <h3 className="font-serif text-2xl leading-none tracking-tight">{product.name}</h3>
                </div>
                <span className="text-lg font-semibold tracking-tight text-foreground">
                  {product.price}
                </span>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">{product.description}</p>
              <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
                <span>{product.inventory} in stock</span>
                <span>{product.featured ? 'Featured pick' : 'Everyday favorite'}</span>
              </div>
              <Button className="w-full rounded-full" onClick={() => addToCart(product.id)}>
                Add to cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
