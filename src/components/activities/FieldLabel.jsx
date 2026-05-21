export default function FieldLabel({ children }) {
  return (
    <legend className="relative -mb-2 ml-3 inline-block bg-white px-1 text-xs font-medium text-gray-500">
      {children}
    </legend>
  )
}

export function FieldBox({ children, className = '' }) {
  return (
    <fieldset className={`rounded-lg border border-gray-200 px-4 pb-3 pt-1 ${className}`}>
      {children}
    </fieldset>
  )
}
