import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'
import {
    Search,
    ChevronDown,
    Filter,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    LayoutGrid,
    GitBranch,
    Map,
} from 'lucide-react'

const users = [
    {
        name: 'Marcus Thorne',
        uid: 'AO-99281',
        role: 'SUPER ADMIN',
        region: 'Global',
        territory: 'All Territories',
        reportsTo: '-',
        status: 'ACTIVE',
        active: '2 mins ago',
        permissions: ['FW', 'OA', 'BL'],
        image:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120',
    },
    {
        name: 'Sarah Jenkins',
        uid: 'AO-11244',
        role: 'COUNTRY ADMIN',
        region: 'USA',
        territory: 'California › Kern',
        reportsTo: 'Marcus Thorne',
        status: 'ACTIVE',
        active: '14h ago',
        permissions: ['FW', '+2'],
        image:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
    },
    {
        name: 'David Chen',
        uid: 'AO-33921',
        role: 'DISTRICT OPERATOR',
        region: 'Pune',
        territory: 'Kothrud',
        reportsTo: 'Le Minh Quan',
        status: 'PENDING',
        active: 'Never',
        permissions: ['RO'],
        image:
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120',
    },
]

export default function UserManagementTable() {
    const navigate = useNavigate()
    return (
        <div className="rounded-[24px] bg-white shadow-sm">
            <div className="border-b border-[#E5E7EB] px-5 pt-4">
                <div className="flex flex-wrap items-center gap-8">
                    <button className="flex items-center gap-2 border-b-2 border-brand-primary pb-4 text-sm font-semibold text-brand-primary">
                        <LayoutGrid className="h-4 w-4" />
                        Table View
                    </button>

                    <button className="flex items-center gap-2 pb-4 text-sm font-medium text-[#232323]">
                        <GitBranch className="h-4 w-4" />
                        Hierarchy Tree
                    </button>

                    <button className="flex items-center gap-2 pb-4 text-sm font-medium text-[#232323]">
                        <Map className="h-4 w-4" />
                        Region View
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-4 px-5 py-5 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex h-11 w-full max-w-[360px] items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white px-4">
                    <Search className="h-4 w-4 text-[#737373]" />

                    <input
                        placeholder="Search by name, ID or email..."
                        className="w-full bg-transparent text-sm outline-none placeholder:text-[#8A94A6]"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    {['Role: All', 'Status: All', 'Region: Global'].map((item) => (
                        <button
                            key={item}
                            className="inline-flex items-center gap-2 text-sm font-medium text-[#232323]"
                        >
                            {item}
                            <ChevronDown className="h-4 w-4" />
                        </button>
                    ))}

                    <button className="inline-flex items-center gap-2 rounded-full border border-[#BCD0C9] px-5 py-2.5 text-sm font-semibold text-brand-primary">
                        <Filter className="h-4 w-4" />
                        More Filters
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-[#F6F7F7]">
                        <tr>
                            {[
                                'USER DETAILS',
                                'ROLE',
                                'ASSIGNED REGION',
                                'REPORTS TO',
                                'STATUS',
                                'LAST ACTIVE',
                                'PERMISSIONS',
                                'ACTIONS',
                            ].map((head) => (
                                <th
                                    key={head}
                                    className="px-6 py-5 text-left text-[11px] font-semibold tracking-[1px] text-[#2B2B2B]"
                                >
                                    {head}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user) => (
                            <tr
                                key={user.name}
                                onClick={() => navigate(`/user-management/${user.uid}`)}
                                className="cursor-pointer border-b border-[#ECEFF1] hover:bg-[#F7FAF9]"
                            >
                                <td className="px-6 py-6">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={user.image}
                                            alt={user.name}
                                            className="h-11 w-11 rounded-full object-cover"
                                        />

                                        <div>
                                            <h3 className="text-[15px] font-semibold leading-6 text-brand-primary">
                                                {user.name}
                                            </h3>

                                            <p className="text-[12px] text-[#4B5563]">
                                                UID: {user.uid}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-6">
                                    <span
                                        className={clsx(
                                            'inline-flex rounded-full px-4 py-2 text-[11px] font-bold',
                                            user.role === 'SUPER ADMIN'
                                                ? 'bg-brand-primary text-white'
                                                : 'bg-[#F1F3F2] text-[#232323]'
                                        )}
                                    >
                                        {user.role}
                                    </span>
                                </td>

                                <td className="px-6 py-6">
                                    <p className="text-sm font-semibold text-[#232323]">
                                        {user.region}
                                    </p>

                                    <p className="text-[13px] text-[#4B5563]">
                                        {user.territory}
                                    </p>
                                </td>

                                <td className="px-6 py-6">
                                    <p className="text-sm font-semibold text-brand-primary">
                                        {user.reportsTo}
                                    </p>
                                </td>

                                <td className="px-6 py-6">
                                    <span
                                        className={clsx(
                                            'inline-flex items-center gap-2 text-sm font-medium',
                                            user.status === 'ACTIVE'
                                                ? 'text-[#16A34A]'
                                                : 'text-[#D97706]'
                                        )}
                                    >
                                        <div
                                            className={clsx(
                                                'h-2.5 w-2.5 rounded-full',
                                                user.status === 'ACTIVE'
                                                    ? 'bg-[#16A34A]'
                                                    : 'bg-[#D97706]'
                                            )}
                                        />

                                        {user.status}
                                    </span>
                                </td>

                                <td className="px-6 py-6 text-sm text-[#232323]">
                                    {user.active}
                                </td>

                                <td className="px-6 py-6">
                                    <div className="flex items-center gap-2">
                                        {user.permissions.map((item) => (
                                            <span
                                                key={item}
                                                className={clsx(
                                                    'inline-flex items-center justify-center rounded-full text-[10px] font-semibold',
                                                    item.startsWith('+')
                                                        ? 'h-6 min-w-[28px] bg-[#ECECEC] px-2 text-[#6B7280]'
                                                        : 'h-6 min-w-[30px] bg-[#F3F4F6] px-2 text-[#232323]'
                                                )}
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </td>

                                <td className="px-6 py-6">
                                    <button
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <MoreVertical className="h-4 w-4 text-[#737373]" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col gap-4 px-6 py-5 xl:flex-row xl:items-center xl:justify-between">
                <p className="text-sm text-[#232323]">
                    Showing 1 to 10 of 1,284 users
                </p>

                <div className="flex items-center gap-2">
                    <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D7DDDA]">
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    <button className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary text-sm font-semibold text-white">
                        1
                    </button>

                    <button className="flex h-9 w-9 items-center justify-center text-sm font-semibold text-[#232323]">
                        2
                    </button>

                    <button className="flex h-9 w-9 items-center justify-center text-sm font-semibold text-[#232323]">
                        3
                    </button>

                    <button className="flex h-9 w-9 items-center justify-center text-sm font-semibold text-[#232323]">
                        ...
                    </button>

                    <button className="flex h-9 w-9 items-center justify-center text-sm font-semibold text-[#232323]">
                        128
                    </button>

                    <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D7DDDA]">
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}