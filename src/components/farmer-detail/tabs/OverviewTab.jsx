import {
  Calendar,
  Droplets,
  FileText,
  Mail,
  MapPin,
  User,
} from 'lucide-react'

function ProgressBar({ value, color = 'bg-brand-primary' }) {
  return (
    <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
    </div>
  )
}

const cardClass = 'rounded-xl border border-gray-100 bg-white p-6 shadow-sm'

export default function OverviewTab({ farmer }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className={cardClass}>
        <h3 className="text-sm font-semibold text-gray-900">Personal Summary</h3>
        <dl className="mt-4 space-y-4">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-gray-400" />
            <div>
              <dt className="text-xs text-gray-500">Gender</dt>
              <dd className="text-sm font-medium text-gray-900">{farmer.gender}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <dt className="text-xs text-gray-500">Age</dt>
              <dd className="text-sm font-medium text-gray-900">{farmer.age}</dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-gray-400" />
            <div>
              <dt className="text-xs text-gray-500">Email Address</dt>
              <dd className="text-sm font-medium text-gray-900">{farmer.email}</dd>
            </div>
          </div>
        </dl>
      </div>

      <div className={cardClass}>
        <h3 className="text-sm font-semibold text-gray-900">Land Summary</h3>
        <p className="mt-4 text-3xl font-bold text-gray-900">
          {farmer.totalAcres} <span className="text-sm font-normal text-gray-500">TOTAL ACRES</span>
        </p>
        <div className="flex items-start gap-3 rounded-lg bg-blue-50/50 p-3">
          <Droplets className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">{farmer.irrigation}</p>
            <p className="text-xs text-gray-500">{farmer.irrigationSub}</p>
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <h3 className="text-sm font-semibold text-gray-900">Follow-up Info</h3>
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-3">
            <FileText className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Last Contact</p>
              <p className="text-sm font-medium text-gray-900">{farmer.lastContact}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-amber-500" />
            <div>
              <p className="text-xs text-gray-500">Next Follow-up</p>
              <p className="text-sm font-semibold text-amber-600">{farmer.nextFollowup}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`${cardClass} lg:col-span-2`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Address & Location</h3>
          <button type="button" className="text-xs font-semibold text-brand-primary hover:underline">
            VIEW ON MAP
          </button>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <img
            src={farmer.fieldImage}
            alt="Farm location"
            className="h-48 w-full rounded-lg object-cover md:h-56"
          />
          <div>
            <dl className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <dt className="text-xs text-gray-500">State</dt>
                <dd className="font-medium text-gray-900">{farmer.state}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">District</dt>
                <dd className="font-medium text-gray-900">{farmer.district}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Taluka</dt>
                <dd className="font-medium text-gray-900">{farmer.taluka}</dd>
              </div>
            </dl>
            <p className="mt-4 flex items-start gap-2 text-sm text-gray-600">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
              {farmer.address}
            </p>
          </div>
        </div>
      </div>

      <div className={`${cardClass} lg:col-span-2`}>
        <h3 className="text-sm font-semibold text-gray-900">Active Crops & Health</h3>
        <div className="mt-6 grid gap-8 sm:grid-cols-2">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">Primary Crop: {farmer.primaryCrop.name}</p>
              <span className="rounded bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                {farmer.primaryCrop.stage}
              </span>
            </div>
            <ProgressBar value={farmer.primaryCrop.progress} />
            <p className="mt-1 text-right text-xs text-gray-500">{farmer.primaryCrop.progress}%</p>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">
                Secondary Crop: {farmer.secondaryCrop.name}
              </p>
              <span className="rounded bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                {farmer.secondaryCrop.stage}
              </span>
            </div>
            <ProgressBar value={farmer.secondaryCrop.progress} color="bg-amber-500" />
            <p className="mt-1 text-right text-xs text-gray-500">{farmer.secondaryCrop.progress}%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
