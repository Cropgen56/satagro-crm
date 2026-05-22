
import {
    Upload,
    Pencil,
    MapPin,
    Mail,
    Phone,
} from 'lucide-react'

export default function ProfileHeader() {
    return (
        <div className="rounded-[28px] border border-[#E8ECEA] bg-white p-7 shadow-sm">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
                    <img
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop"
                        alt=""
                        className="h-[118px] w-[118px] rounded-full object-cover shadow-md"
                    />

                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-[44px] font-Semibold tracking-[-1px] text-brand-primary">
                                Alex Rivers
                            </h1>

                            <span className="rounded-full bg-brand-primary px-4 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                                Operations Manager
                            </span>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-7 text-[15px] text-[#4B5563]">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Maharashtra, India
                            </div>

                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                m.green@agricrm-ent.com
                            </div>

                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                +91 98765 43210
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-primary px-7 py-4 text-[16px] font-semibold text-white shadow-sm">
                        <Upload className="h-4 w-4" />
                        Upload Photo
                    </button>

                    <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#CAD3CF] bg-white px-7 py-4 text-[16px] font-semibold text-[#1F2937]">
                        <Pencil className="h-4 w-4" />
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>
    )
}