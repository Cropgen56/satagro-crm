import { Link } from 'react-router-dom'
import {
  ArrowRight,
  FileText,
  Package,
  Receipt,
  ShoppingBag,
} from 'lucide-react'
import clsx from 'clsx'
import PageTopBar from '@/components/layout/PageTopBar'

const cards = [
  {
    to: '/ecommerce/products',
    icon: Package,
    title: 'Products',
    description: 'Add bio-input products with images, pricing, stock, and availability.',
    accent: 'from-emerald-50 to-white',
    iconBg: 'bg-emerald-100 text-emerald-700',
  },
  {
    to: '/ecommerce/orders',
    icon: ShoppingBag,
    title: 'Orders',
    description: 'Track farmer purchases, fulfillment status, and cancellations.',
    accent: 'from-sky-50 to-white',
    iconBg: 'bg-sky-100 text-sky-700',
  },
  {
    to: '/ecommerce/payments',
    icon: Receipt,
    title: 'Payments',
    description: 'View Razorpay payment history, refunds, and transaction status.',
    accent: 'from-violet-50 to-white',
    iconBg: 'bg-violet-100 text-violet-700',
  },
  {
    to: '/ecommerce/invoices',
    icon: FileText,
    title: 'Invoices',
    description: 'Download printable invoices for paid shop orders.',
    accent: 'from-amber-50 to-white',
    iconBg: 'bg-amber-100 text-amber-800',
  },
]

export default function EcommercePage() {
  return (
    <div className="min-h-full p-6 lg:p-8">
      <PageTopBar />

      <header className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-primary/70">
          Ecommerce
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-brand-primary lg:text-[28px]">
          Farmer shop operations
        </h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-gray-500">
          Manage the BioDrops farmer shop — catalog, orders, payments, and invoices from one hub.
        </p>
      </header>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ to, icon: Icon, title, description, accent, iconBg }) => (
          <Link
            key={to}
            to={to}
            className={clsx(
              'group relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br p-6 shadow-sm ring-1 ring-black/[0.02] transition',
              'hover:-translate-y-0.5 hover:border-brand-primary/20 hover:shadow-md',
              accent,
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div
                className={clsx(
                  'flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm',
                  iconBg,
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-brand-primary" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-gray-900 group-hover:text-brand-primary">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">{description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-brand-primary/10 bg-brand-light/30 px-6 py-5">
        <p className="text-sm font-medium text-brand-primary">Quick tip</p>
        <p className="mt-1 text-sm text-gray-600">
          Set products to <span className="font-semibold text-gray-800">Active</span> with at least
          one cover image so they appear in the BioDrops farmer shop catalog.
        </p>
      </div>
    </div>
  )
}
