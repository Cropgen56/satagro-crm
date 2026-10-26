export default function PageHeader({
  title,
  subtitle = 'Overview of operations and performance',
}) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-bold text-brand-primary lg:text-[28px]">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
    </header>
  )
}
