import React, { useMemo, useState } from 'react'
import PageTopBar from '@/components/layout/PageTopBar'
import AdvisoryHeader from '@/components/advisory/AdvisoryHeader'
import AdvisoryKpiCard from '@/components/advisory/AdvisoryKpiCard'
import AdvisoryTable from '@/components/advisory/AdvisoryTable'
import AdvisoryFilterBar from '@/components/advisory/AdvisoryFilterBar'

import {
    advisoryData,
    advisoryKpis,
} from '@/data/advisory'

const AdvisoryPage = () => {
    const [filters, setFilters] = useState({
        type: 'Advisory Type',
        crop: 'Crop Type',
        district: 'District',
        status: 'Delivery Status',
        createdBy: 'Created By',
        date: 'Date Range',
    })

    const filteredAdvisories = useMemo(() => {
        return advisoryData.filter((item) => {
            const matchesType =
                filters.type === 'Advisory Type' ||
                item.advisory.subtitle
                    .toLowerCase()
                    .includes(filters.type.toLowerCase())

            const matchesCrop =
                filters.crop === 'Crop Type' ||
                item.cropType.includes(filters.crop)

            const matchesDistrict =
                filters.district === 'District' ||
                item.audience.includes(filters.district)

            const matchesStatus =
                filters.status === 'Delivery Status' ||
                item.status.label === filters.status

            const matchesCreatedBy =
                filters.createdBy === 'Created By' ||
                item.createdBy === filters.createdBy

            return (
                matchesType &&
                matchesCrop &&
                matchesDistrict &&
                matchesStatus &&
                matchesCreatedBy
            )
        })
    }, [filters])

    return (
        <div className="min-h-full p-6 lg:p-8">
            <PageTopBar />

            <div className="mt-8">
                <AdvisoryHeader />

                <div className="mb-7 mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {advisoryKpis.map((kpi) => (
                        <AdvisoryKpiCard
                            key={kpi.label}
                            {...kpi}
                        />
                    ))}
                </div>

                <AdvisoryFilterBar
                    filters={filters}
                    setFilters={setFilters}
                />

                <AdvisoryTable advisories={filteredAdvisories} />
            </div>
        </div>
    )
}

export default AdvisoryPage