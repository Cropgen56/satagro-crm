import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MoreVertical, Pencil, Trash2, Eye } from 'lucide-react'
import { deleteCrmUser } from '@/lib/usermanagement'

export default function UserRowActions({ user, onDeleted }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Remove "${user.name}" from the CRM team? They will lose admin access.`
      )
    ) {
      return
    }
    try {
      setLoading(true)
      await deleteCrmUser(user.id)
      setOpen(false)
      onDeleted?.()
    } catch (err) {
      window.alert(err.message || 'Failed to delete user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={loading}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
        aria-label="More actions"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open ? (
        <div
          className="absolute right-0 z-20 mt-1 min-w-[148px] rounded-xl border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black/5"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => {
              setOpen(false)
              navigate(`/user-management/${user.id}`)
            }}
          >
            <Eye className="h-4 w-4" />
            View
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => {
              setOpen(false)
              navigate(`/user-management/${user.id}/edit`)
            }}
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
          <button
            type="button"
            disabled={loading}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
            {loading ? 'Removing...' : 'Remove'}
          </button>
        </div>
      ) : null}
    </div>
  )
}
