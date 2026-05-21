import PageHeader from '@/components/layout/PageHeader'

export default function EmptyPage({ title }) {
  return (
    <div className="p-6 lg:p-8">
      <PageHeader title={title} subtitle="" />
      <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white">
        <p className="text-sm text-gray-400">{title} content coming soon</p>
      </div>
    </div>
  )
}
