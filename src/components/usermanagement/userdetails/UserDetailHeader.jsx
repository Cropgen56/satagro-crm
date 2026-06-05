import {
  ShieldCheck,
  Mail,
  Phone,
  UserRound,
  ArrowLeft,
  Pencil,
  Trash2,
} from 'lucide-react'
import { UserAvatar } from '@/components/ui/EmptyState'

function formatDate(date) {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString()
}

export default function UserDetailHeader({
  user,
  loading,
  onSuspend,
  onEdit,
  onDelete,
  suspendDisabled,
  actionDisabled,
  deleteDisabled = false,
  deleteHint = '',
  onBack,
}) {
  const assignedRegions = [user?.region, user?.territory]
    .filter((v) => v && v !== '—')
    .slice(0, 2)

  const displayStatus = user?.statusLabel || user?.status || 'PENDING'
  const statusColor =
    user?.status === 'ACTIVE'
      ? 'text-[#16A34A]'
      : user?.status === 'DISABLED'
        ? 'text-[#DC2626]'
        : user?.status === 'VERIFIED'
          ? 'text-[#2563EB]'
          : 'text-[#D97706]'

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-brand-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to User Management
          </button>
          <h1 className="text-2xl font-bold text-brand-primary lg:text-[28px]">
            User Details
          </h1>
          <p className="mt-1 max-w-[520px] text-sm leading-6 text-gray-500">
            View, edit, suspend, or remove CRM team members.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={actionDisabled}
            onClick={onEdit}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>

          <button
            type="button"
            disabled={suspendDisabled}
            onClick={onSuspend}
            className="rounded-lg border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-amber-800 shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            {user?.status === 'DISABLED' ? 'Suspended' : 'Suspend'}
          </button>

          <button
            type="button"
            disabled={actionDisabled || deleteDisabled}
            title={deleteHint || undefined}
            onClick={onDelete}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </button>
        </div>
        {deleteHint ? (
          <p className="mt-2 text-xs text-gray-500">{deleteHint}</p>
        ) : null}
      </div>

      <div className="mt-5 rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <UserAvatar
                name={user?.name}
                avatar={user?.avatar}
                className="h-24 w-24 rounded-lg text-2xl"
              />
              <div className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-brand-primary text-white">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-[20px] font-semibold text-[#202939]">
                  {loading ? 'Loading...' : user?.name || 'User'}
                </h2>

                <span className="rounded-full bg-[#9FE7D7] px-3 py-1 text-[10px] font-bold uppercase text-brand-primary">
                  {user?.role || 'N/A'}
                </span>

                <span className={`flex items-center gap-1 text-xs font-semibold ${statusColor}`}>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      user?.status === 'ACTIVE'
                        ? 'bg-[#16A34A]'
                        : user?.status === 'DISABLED'
                          ? 'bg-[#DC2626]'
                          : user?.status === 'VERIFIED'
                            ? 'bg-[#2563EB]'
                            : 'bg-[#D97706]'
                    }`}
                  />
                  {displayStatus}
                </span>
              </div>

              <p className="mt-1 text-sm text-[#4B5563]">
                ID: {user?.uid || user?.id || 'N/A'} • Created: {formatDate(user?.createdAt)}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-[#374151]">
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {user?.contactEmail || user?.invitationEmail || user?.email || 'N/A'}
                </span>

                <span className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {user?.phone || 'N/A'}
                </span>

                <span className="flex items-center gap-2">
                  <UserRound className="h-4 w-4" />
                  Manager: {user?.reportsTo || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="border-l border-[#E5E7EB] pl-8">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#6B7280]">
              Assigned Regions
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {(assignedRegions.length ? assignedRegions : ['N/A']).map((item) => (
                <span
                  key={item}
                  className="rounded-lg bg-[#E7EFEC] px-3 py-2 text-xs font-semibold text-brand-primary"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
