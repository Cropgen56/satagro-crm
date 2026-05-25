// components/usermanagement/userdetails/UserDetailHeader.jsx

import {
  MoreVertical,
  ShieldCheck,
  Mail,
  Phone,
  UserRound,
} from 'lucide-react'

export default function UserDetailHeader() {
  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary lg:text-[28px]">
            User Details
          </h1>

          <p className="mt-1 max-w-[520px] text-sm leading-6 text-gray-500">
            Manage user profile, permissions, and operational access across the regional hierarchy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm">
            <ShieldCheck className="h-4 w-4" />
            Edit Permissions
          </button>

          <button className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm">
            Disable User
          </button>

          <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160"
                alt=""
                className="h-24 w-24 rounded-lg object-cover"
              />
              <div className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-brand-primary text-white">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-[20px] font-semibold text-[#202939]">
                  Alex Rivers
                </h2>

                <span className="rounded-full bg-[#9FE7D7] px-3 py-1 text-[10px] font-bold uppercase text-brand-primary">
                  State Admin
                </span>

                <span className="flex items-center gap-1 text-xs font-semibold text-[#16A34A]">
                  <span className="h-2 w-2 rounded-full bg-[#16A34A]" />
                  Active
                </span>
              </div>

              <p className="mt-1 text-sm text-[#4B5563]">
                ID: UID-98230 • Created: Oct 24, 2023
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-[#374151]">
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  alex.rivers@cropgen.com
                </span>

                <span className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  +91 98230 44556
                </span>

                <span className="flex items-center gap-2">
                  <UserRound className="h-4 w-4" />
                  Manager: Marcus Thorne
                </span>
              </div>
            </div>
          </div>

          <div className="border-l border-[#E5E7EB] pl-8">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#6B7280]">
              Assigned Regions
            </p>

            <div className="mt-3 flex gap-2">
              {['Maharashtra', 'Pune'].map((item) => (
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