// AdvisoryTable.jsx

import clsx from 'clsx'
import {
    Bell,
    Bug,
    ChevronLeft,
    ChevronRight,
    Droplets,
    Leaf,
    MessageSquare,
    MoreVertical,
    Radio,
    Sprout,
} from 'lucide-react'

const columns = [
    'Advisory',
    'Crop Type',
    'Audience',
    'Delivery',
    'Created By',
    'Sent Date',
    'Status',
    'Reach',
    '',
]

const advisoryIcons = {
    bug: Bug,
    droplets: Droplets,
    sprout: Sprout,
    leaf: Leaf,
}

const deliveryIcons = {
    sms: MessageSquare,
    push: Bell,
    broadcast: Radio,
}

export default function AdvisoryTable({ advisories }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[1350px]">
                    <thead>
                        <tr className="border-b border-gray-100 bg-[#FAFAFA]">
                            {columns.map((column) => (
                                <th
                                    key={column}
                                    className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500 whitespace-nowrap"
                                >
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {advisories.map((item) => {
                            const Icon = advisoryIcons[item.advisory.icon]

                            return (
                                <tr
                                    key={item.id}
                                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/40"
                                >
                                    {/* Advisory */}
                                    <td className="px-5 py-5">
                                        <div className="flex items-center gap-3 min-w-[320px]">
                                            <div
                                                className={clsx(
                                                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                                                    item.advisory.color
                                                )}
                                            >
                                                <Icon className="h-4 w-4" />
                                            </div>

                                            <div>
                                                <h3 className="text-[14px] font-semibold text-[#064E3B] leading-snug">
                                                    {item.advisory.title}
                                                </h3>

                                                <p className="mt-0.5 text-[12px] text-gray-500">
                                                    {item.advisory.subtitle}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Crop */}
                                    <td className="whitespace-nowrap px-5 py-5 text-[13px] text-gray-700">
                                        {item.cropType}
                                    </td>

                                    {/* Audience */}
                                    <td className="whitespace-nowrap px-5 py-5 text-[13px] text-gray-700">
                                        {item.audience}
                                    </td>

                                    {/* Delivery */}
                                    <td className="px-5 py-5">
                                        <div className="flex items-center gap-2">
                                            {item.delivery.map((type) => {
                                                const DeliveryIcon =
                                                    deliveryIcons[type]

                                                return (
                                                    <DeliveryIcon
                                                        key={type}
                                                        className="h-4 w-4 text-gray-500"
                                                    />
                                                )
                                            })}
                                        </div>
                                    </td>

                                    {/* Created By */}
                                    <td className="whitespace-nowrap px-5 py-5 text-[13px] text-gray-700">
                                        {item.createdBy}
                                    </td>

                                    {/* Sent Date */}
                                    <td className="whitespace-nowrap px-5 py-5 text-[13px] text-gray-700">
                                        {item.sentDate}
                                    </td>

                                    {/* Status */}
                                    <td className="px-5 py-5">
                                        <span
                                            className={clsx(
                                                'inline-flex whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold',
                                                item.status.badge
                                            )}
                                        >
                                            {item.status.label}
                                        </span>
                                    </td>

                                    {/* Reach */}
                                    <td className="whitespace-nowrap px-5 py-5 text-[14px] font-bold text-[#064E3B]">
                                        {item.reach}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-5 py-5">
                                        <button className="text-gray-500 transition hover:text-gray-700">
                                            <MoreVertical className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row">
                <p className="text-[12px] text-gray-500">
                    Showing 1 to 10 of 1,482 advisories
                </p>

                <div className="flex items-center gap-1.5">
                    <button className="text-gray-400">
                        <ChevronLeft className="h-3.5 w-3.5" />
                    </button>

                    <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#065F46] text-[12px] font-semibold text-white">
                        1
                    </button>

                    <button className="h-8 w-8 text-[12px] font-semibold text-gray-600">
                        2
                    </button>

                    <button className="h-8 w-8 text-[12px] font-semibold text-gray-600">
                        3
                    </button>

                    <span className="px-1 text-[12px] text-gray-400">...</span>

                    <button className="text-[12px] font-semibold text-gray-600">
                        148
                    </button>

                    <button className="text-gray-400">
                        <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        </div>
    )
}