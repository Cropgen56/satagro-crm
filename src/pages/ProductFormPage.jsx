import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Settings2 } from 'lucide-react'
import FormSection from '@/components/add-farmer/FormSection'
import PageTopBar from '@/components/layout/PageTopBar'
import ProductForm, { productToForm } from '@/components/products/ProductForm'
import ProductPreview from '@/components/products/ProductPreview'
import { createProduct, fetchProductById, updateProduct } from '@/lib/products'

export default function ProductFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [product, setProduct] = useState(null)
  const [previewForm, setPreviewForm] = useState(() => productToForm(null))
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleFormChange = useCallback((form) => {
    setPreviewForm(form)
  }, [])

  useEffect(() => {
    if (!isEdit) return
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const res = await fetchProductById(id)
        if (!cancelled) {
          const loaded = res?.product || null
          setProduct(loaded)
          setPreviewForm(productToForm(loaded))
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load product')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id, isEdit])

  const handleSubmit = async (payload) => {
    try {
      setSubmitting(true)
      setError('')
      if (isEdit) {
        await updateProduct(id, payload)
      } else {
        await createProduct(payload)
      }
      navigate('/ecommerce/products')
    } catch (err) {
      setError(err.message || 'Failed to save product')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-full p-6 lg:p-8">
        <div className="h-5 w-32 animate-pulse rounded-lg bg-gray-100" />
        <div className="mt-6 h-10 w-64 animate-pulse rounded-lg bg-gray-100" />
        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="h-[640px] animate-pulse rounded-2xl bg-gray-100" />
          <div className="hidden h-96 animate-pulse rounded-2xl bg-gray-100 xl:block" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full p-6 lg:p-8">
      <Link
        to="/ecommerce/products"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 transition hover:text-gray-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      <PageTopBar />

      <header className="mt-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-primary/70">
              Ecommerce · Catalog
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-brand-primary lg:text-[28px]">
              {isEdit ? 'Edit product' : 'Create product'}
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {isEdit
                ? 'Update listing details, pricing, and inventory for the BioDrops farmer shop.'
                : 'Build a polished shop listing with images, pricing, and stock rules — preview how farmers will see it.'}
            </p>
          </div>
          {isEdit && product?.status ? (
            <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold capitalize text-brand-primary">
              {product.status}
            </span>
          ) : null}
        </div>
      </header>

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:p-8">
          <ProductForm
            initial={product}
            onSubmit={handleSubmit}
            onFormChange={handleFormChange}
            submitting={submitting}
            error={error}
            isEdit={isEdit}
          />
        </div>

        <aside className="hidden xl:block">
          <ProductPreview form={previewForm} />
        </aside>
      </div>

      <div className="mt-6 xl:hidden">
        <FormSection icon={Settings2} title="Farmer shop preview">
          <ProductPreview form={previewForm} />
        </FormSection>
      </div>
    </div>
  )
}
