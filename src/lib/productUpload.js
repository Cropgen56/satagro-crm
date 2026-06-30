import { apiRequest } from '@/lib/api'

export async function presignProductImage(fileType) {
  return apiRequest('/crm/products/image-presign', {
    method: 'POST',
    body: { fileType },
  })
}

export async function uploadProductImage(file) {
  const presign = await presignProductImage(file.type)
  const uploadUrl = presign?.uploadUrl
  const publicUrl = presign?.publicUrl

  if (!uploadUrl || !publicUrl) {
    throw new Error('Failed to get upload URL')
  }

  const putRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  })

  if (!putRes.ok) {
    throw new Error('Image upload failed')
  }

  return publicUrl
}
