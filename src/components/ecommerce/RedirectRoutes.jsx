import { Navigate, useParams } from 'react-router-dom'

export function RedirectProductEdit() {
  const { id } = useParams()
  return <Navigate to={`/ecommerce/products/${id}/edit`} replace />
}

export function RedirectOrderDetail() {
  const { id } = useParams()
  return <Navigate to={`/ecommerce/orders/${id}`} replace />
}
