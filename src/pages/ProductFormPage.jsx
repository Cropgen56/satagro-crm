import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageTopBar from '@/components/layout/PageTopBar'
import ProductForm from '@/components/products/ProductForm'
import { createProduct, fetchProductById, updateProduct } from '@/lib/products'

export default function ProductFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const res = await fetchProductById(id)
        if (!cancelled) setProduct(res?.product || null)
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
      navigate('/products')
    } catch (err) {
      setError(err.message || 'Failed to save product')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageTopBar />
        <p className="text-sm text-gray-500">Loading product...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageTopBar />
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-brand-primary">
          {isEdit ? 'Edit product' : 'Add product'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isEdit ? 'Update catalog details for the farmer shop.' : 'Create a new shop product.'}
        </p>
      </div>
      <ProductForm
        initial={product}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={error}
      />
    </div>
  )
}
