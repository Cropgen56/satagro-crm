export function Label({ children }) {
  return <label className="mb-1.5 block text-xs font-medium text-gray-600">{children}</label>
}

export function Input({ className = '', badge, ...props }) {
  return (
    <div className="relative">
      <input
        className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary ${badge ? 'pr-24' : ''} ${className}`}
        {...props}
      />
      {badge && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700">
          {badge}
        </span>
      )}
    </div>
  )
}

export function Select({ children, className = '', ...props }) {
  return (
    <select
      className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`min-h-[100px] w-full resize-y rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary ${className}`}
      {...props}
    />
  )
}
