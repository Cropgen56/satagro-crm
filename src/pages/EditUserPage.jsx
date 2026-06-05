import { useParams, useNavigate } from 'react-router-dom'
import PageTopBar from '@/components/layout/PageTopBar'
import EditUserForm from '@/components/usermanagement/EditUserForm'
import { ArrowLeft } from 'lucide-react'

export default function EditUserPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <div className="min-h-full bg-[#F6F8F7] p-6 lg:p-8">
      <PageTopBar />

      <button
        type="button"
        onClick={() => navigate('/user-management')}
        className="mt-8 inline-flex items-center gap-1 text-sm font-medium text-brand-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to User Management
      </button>

      <div className="mt-6 max-w-3xl">
        <EditUserForm key={id} userId={id} />
      </div>
    </div>
  )
}
