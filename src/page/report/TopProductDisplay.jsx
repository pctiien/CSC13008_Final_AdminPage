import { formatCurrency } from '../../utils/format'

export function TopProductDisplay({ data }) {

  return (
    <div className="space-y-6">
      
      <div className="rounded-lg border bg-card p-6 bg-white">
        <h3 className="text-lg font-semibold mb-2">Top {data.length} products</h3>
        <p className="text-3xl font-bold text-primary"></p>
      </div>
      <div className="rounded-lg border bg-white">
        <div className="p-4 grid grid-cols-4 font-medium bg-muted bg-gray-100 rounded-t-lg">
          <div>Time Period</div>
          <div className="">Revenue</div>
          <div className="">Product</div>
          <div className="">Quantity</div>

        </div>
        <div className="divide-y">
          {data.map((item, index) => (
            <div key={index} className="p-4 grid grid-cols-4">
              <div>{item.timePeriod}</div>
              <div className="">{item.totalRevenue}</div>
              <div className="">{item.productName}</div>
              <div className="">{item.totalQuantity}</div>

            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

