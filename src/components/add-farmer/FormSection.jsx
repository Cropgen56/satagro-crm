export default function FormSection({ icon: Icon, title, children, className = '' }) {
  return (
    <section className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-light text-brand-primary">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </section>
  )
}
