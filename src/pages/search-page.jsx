import { useDeferredValue, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { SectionHeading } from '../components/section-heading'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { useStore } from '../context/store-context'
import { searchSuggestions } from '../data/products'

export function SearchPage() {
  const { products, searchHistory, searchQuery, commitSearch, setSearchQuery, addToCart } = useStore()
  const [draftQuery, setDraftQuery] = useState(searchQuery)
  const deferredQuery = useDeferredValue(draftQuery)
  const navigate = useNavigate()
  const normalizedQuery = deferredQuery.trim().toLowerCase()
  const filteredProducts = useMemo(() => {
    if (!normalizedQuery) {
      return products
    }

    return products.filter((product) => {
      const haystack = [product.name, product.category, product.description].join(' ').toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [normalizedQuery, products])

  function handleSearchSubmit(event) {
    event.preventDefault()
    commitSearch(draftQuery)
  }

  function handleSuggestionClick(value) {
    setDraftQuery(value)
    setSearchQuery(value)
    commitSearch(value)
  }

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Search the collection"
        title="Find products by mood, room, or routine."
        copy="Search results update against the live catalog, and your recent searches are cached locally for the next visit."
      />

      <Card className="rounded-[1.75rem] border-border/70 bg-card/85 shadow-none">
        <CardContent className="space-y-6 p-6 sm:p-8">
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSearchSubmit}>
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="h-12 rounded-full border-border/80 bg-background/80 pl-11"
                placeholder="Search for coffee sets, candles, soft layers..."
                type="search"
                value={draftQuery}
                onChange={(event) => setDraftQuery(event.target.value)}
              />
            </div>
            <Button className="h-12 rounded-full px-6" type="submit">
              Search catalog
            </Button>
          </form>

          <div className="flex flex-wrap gap-2">
            {[...searchSuggestions, ...searchHistory].slice(0, 8).map((suggestion) => (
              <Badge
                key={suggestion}
                className="cursor-pointer rounded-full px-3 py-1"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="rounded-[1.75rem] border-border/70 bg-card/85 shadow-none">
            <CardContent className="space-y-3 p-6">
              <p className="text-sm font-medium text-muted-foreground">{product.category}</p>
              <h3 className="font-serif text-2xl leading-none tracking-tight">{product.name}</h3>
              <p className="text-sm leading-6 text-muted-foreground">{product.description}</p>
              <div className="flex gap-3">
                <Button className="flex-1 rounded-full" onClick={() => addToCart(product.id)}>
                  Add to cart
                </Button>
                <Button asChild className="flex-1 rounded-full" variant="outline">
                  <Link to="/shop">View in shop</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <Card className="rounded-[1.75rem] border-border/70 bg-card/85 shadow-none">
          <CardContent className="space-y-4 p-6">
            <h3 className="font-serif text-2xl leading-none tracking-tight">No products matched</h3>
            <p className="text-sm leading-6 text-muted-foreground">
              Try a broader phrase like "coffee" or "home" or jump back to the full catalog.
            </p>
            <Button className="w-fit rounded-full" onClick={() => navigate('/shop')}>
              Browse all products
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
