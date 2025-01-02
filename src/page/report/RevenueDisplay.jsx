import { formatCurrency } from '../../utils/format'

export function RevenueDisplay({ data }) {
  const totalRevenue = data.reduce((sum, item) => sum + item.totalRevenue, 0)

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6 bg-white">
        <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
        <p className="text-3xl font-bold text-primary">{formatCurrency(totalRevenue)}</p>
      </div>
      
      <div className="rounded-lg border bg-white">
        <div className="p-4 grid grid-cols-3 font-medium bg-muted bg-gray-100 rounded-t-lg">
          <div>Time Period</div>
          <div className="text-right">Revenue</div>
        </div>
        <div className="divide-y">
          {data.map((item, index) => (
            <div key={index} className="p-4 grid grid-cols-3">
              <div>{item.timePeriod}</div>
              <div className="text-right">{formatCurrency(item.totalRevenue)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

