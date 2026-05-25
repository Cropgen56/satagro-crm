import {
  CheckCircle2,
  XCircle,
  ArrowRight,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

const rows = [
  {
    name: 'Farmers Management',
    view: true,
    edit: true,
    create: true,
    delete: false,
  },
  {
    name: 'Activities & Schedules',
    view: true,
    edit: true,
    create: true,
    delete: true,
  },
  {
    name: 'Task Management',
    view: true,
    edit: true,
    create: false,
    delete: false,
  },
  {
    name: 'Crop Advisories',
    view: true,
    edit: true,
    create: true,
    delete: false,
  },
  {
    name: 'Analytical Reports',
    view: true,
    edit: false,
    create: false,
    delete: false,
  },
]

function Icon({ active }) {
  return active ? (
    <CheckCircle2 className="h-4 w-4 text-brand-primary" />
  ) : (
    <XCircle className="h-4 w-4 text-[#C7CFCC]" />
  )
}

export default function PermissionSummaryTable() {
  const navigate = useNavigate()

  return (
    <div>
      <h2 className="text-[16px] font-semibold text-[#202939]">
        Role Permission Summary
      </h2>

      <div className="mt-5 overflow-hidden rounded-2xl border border-[#DCE3E0]">
        <table className="min-w-full">
          <thead className="bg-[#F5F7F6]">
            <tr>
              {[
                'Module Name',
                'View',
                'Edit',
                'Create',
                'Delete',
              ].map((item) => (
                <th
                  key={item}
                  className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-[#4B5563]"
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={row.name}
                className="border-t border-[#EDF1EF]"
              >
                <td className="px-6 py-4 text-[13px] font-semibold text-[#202939]">
                  {row.name}
                </td>

                <td className="px-6 py-4">
                  <Icon active={row.view} />
                </td>

                <td className="px-6 py-4">
                  <Icon active={row.edit} />
                </td>

                <td className="px-6 py-4">
                  <Icon active={row.create} />
                </td>

                <td className="px-6 py-4">
                  <Icon active={row.delete} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex items-center justify-end gap-3">
        <button
          onClick={() => navigate('/invite-user')}
          className="rounded-xl border border-[#CBD5D1] bg-white px-6 py-3 text-[13px] font-medium text-[#374151]"
        >
          Back
        </button>

        <button   onClick={() => navigate('/region-assignment')}
        className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-6 py-3 text-[13px] font-semibold text-white shadow-sm transition hover:bg-brand-950">
          Continue to Region Assignment
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}