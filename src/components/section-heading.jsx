export function SectionHeading({ eyebrow, title, copy, align = 'split' }) {
  const containerClassName =
    align === 'stacked'
      ? 'flex flex-col gap-4'
      : 'flex flex-col gap-4 md:flex-row md:items-end md:justify-between'

  return (
    <div className={containerClassName}>
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">{eyebrow}</p>
        <h2 className="max-w-3xl font-serif text-4xl leading-none tracking-tight text-foreground md:text-5xl">
          {title}
        </h2>
      </div>
      {copy ? <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{copy}</p> : null}
    </div>
  )
}
