// components/usermanagement/permission/PermissionUserSummary.jsx

export default function PermissionUserSummary() {
  const details = [
    { label: 'EMAIL ADDRESS', value: 'alex.rivers@cropgen.com' },
    { label: 'REPORTING MANAGER', value: 'Marcus Thorne' },
    { label: 'CONTACT NUMBER', value: '+91 98765-43210' },
    { label: 'DELIVERY METHOD', value: 'Email + SMS' },
  ]

  return (
    <div className="mt-6 rounded-[22px] border border-[#E5E7EB] bg-white px-7 py-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_1fr_1fr_1fr_1fr]">
        <div className="flex items-center gap-4 xl:border-r xl:border-[#E5E7EB] xl:pr-5">
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200"
            alt=""
            className="h-16 w-16 rounded-full object-cover"
          />

          <div>
            <h3 className="text-[16px] font-semibold text-brand-primary">
              Alex Rivers
            </h3>

            <p className="mt-1 text-[13px] font-semibold text-brand-primary">
              State Admin
            </p>
          </div>
        </div>

        {details.map((item) => (
          <div key={item.label}>
            <p className="text-[11px] font-bold tracking-wide text-[#6B7280]">
              {item.label}
            </p>

            <p className="mt-2 text-[15px] font-semibold text-brand-primary">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}