import { cn } from '../../lib/utils'

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground shadow-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:ring-4 focus-visible:ring-ring/60 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
