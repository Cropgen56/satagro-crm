import React, { useMemo, useState } from 'react'
import SubscriptionHeader from '@/components/subscriptions/SubscriptionHeader'
import PageTopBar from '@/components/layout/PageTopBar'
import SubscriptionKpiCard from '@/components/subscriptions/SubscriptionKpicards'
import SubscriptionTable from '@/components/subscriptions/SubscriptionTable'
import SubscriptionFilterBar from '@/components/subscriptions/SubscriptionFilterBar'
import RenewalForecastCard from '@/components/subscriptions/RenewalForecastCard'
import ChurnAlertCard from '@/components/subscriptions/ChurnAlertCard'
import {
    subscriptionKpis,
    subscriptionsData,
} from '@/data/subscription'

const SubscriptionPage = () => {
    const [filters, setFilters] = useState({
        status: 'All',
        plan: 'Plan Type',
        district: 'District',
        agent: 'Agent',
        expiry: 'Next 30 Days',
    })

    const filteredSubscriptions = useMemo(() => {
        return subscriptionsData.filter((subscription) => {
            const matchesStatus =
                filters.status === 'All' ||
                subscription.status.label === filters.status

            const matchesPlan =
                filters.plan === 'Plan Type' ||
                subscription.plan.name
                    .toLowerCase()
                    .includes(filters.plan.toLowerCase())

            const matchesDistrict =
                filters.district === 'District' ||
                subscription.farmer.district.includes(filters.district)

            const matchesAgent =
                filters.agent === 'Agent' ||
                subscription.agent.name === filters.agent

            return (
                matchesStatus &&
                matchesPlan &&
                matchesDistrict &&
                matchesAgent
            )
        })
    }, [filters])

    return (
        <div className="min-h-full p-6 lg:p-8">
            <PageTopBar />

            <div className="mt-8">
                <SubscriptionHeader />

                {/* KPI */}
                <div className="mb-7 mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {subscriptionKpis.map((kpi) => (
                        <SubscriptionKpiCard key={kpi.label} {...kpi} />
                    ))}
                </div>

                <SubscriptionFilterBar
                    filters={filters}
                    setFilters={setFilters}
                />

                <SubscriptionTable
                    subscriptions={filteredSubscriptions}
                />

                <div className="mt-8 grid gap-5 xl:grid-cols-[1.9fr_0.75fr]">
                    <RenewalForecastCard />
                    <ChurnAlertCard />
                </div>
            </div>
        </div>
    )
}

export default SubscriptionPage

