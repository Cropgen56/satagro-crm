import PageTopBar from '@/components/layout/PageTopBar'

export default function EcommercePageShell({
  section,
  title,
  description,
  action,
  children,
  contentClassName = 'mt-8 space-y-6',
}) {
  return (
    <div className="min-h-full p-6 lg:p-8">
      <PageTopBar />

      <header className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-primary/70">
            Ecommerce · {section}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-brand-primary lg:text-[28px]">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-gray-500">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>

      <div className={contentClassName}>{children}</div>
    </div>
  )
}
