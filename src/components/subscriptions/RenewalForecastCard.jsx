import { TrendingUp } from 'lucide-react'

const bars = [
    { month: 'FEB', height: 'h-[110px]', color: 'bg-[#B7E7DE]' },
    { month: 'MAR', height: 'h-[165px]', color: 'bg-[#8DDFD0]' },
    { month: 'APR', height: 'h-[230px]', color: 'bg-[#014D40]' },
    { month: 'MAY', height: 'h-[125px]', color: 'bg-[#92E2D4]' },
    { month: 'JUN', height: 'h-[90px]', color: 'bg-[#B7E7DE]' },
]

export default function RenewalForecastCard() {
    return (
        <div className="rounded-[30px] bg-[#F8FAF9] px-8 py-7 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-[20px] font-semibold text-[#014D40]">
                        Renewal Forecast
                    </h2>

                    <p className="mt-1 text-sm text-[#7A7A7A]">
                        Expected subscription revenue for the next 90 days
                    </p>
                </div>

                <TrendingUp className="h-8 w-8 text-[#0D9488]" strokeWidth={2.2} />
            </div>

            <div className="mt-8 flex items-end justify-between px-4">
                {bars.map((bar) => (
                    <div
                        key={bar.month}
                        className="flex flex-col items-center justify-end"
                    >
                        <div
                            className={`${bar.height} ${bar.color} w-[95px] rounded-t-[18px]`}
                        />

                        <span className="mt-4 text-xs tracking-[0.25em] text-[#7A7A7A]">
                            {bar.month}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}