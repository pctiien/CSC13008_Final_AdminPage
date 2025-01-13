import React from 'react';
import orderService from '../../service/orderService'
import SearchBar from '../../components/SearchBar'
import { format } from "date-fns"
import {Pencil} from 'lucide-react';
import OrderDetails from './OrderDetails'

const OrderList = ()=>{
    const [orders,setOrders] = React.useState([])
    const [selectedStatus, setSelectedStatus] = React.useState('')

    const [dialogOpen, setDialogOpen] = React.useState(false)
    const handleCloseDialog = () => {
        setDialogOpen(false)
        setSelectedOrderId(null)
    }
    const [selectedOrderId, setSelectedOrderId] = React.useState(null)
    const handleViewDetails = (orderId)=>{
        setSelectedOrderId(orderId)
        setDialogOpen(true)
    
      }
    const fetchOrders = React.useCallback(async (status) => {
        try {
            const result = await orderService.getAllOrders(status);
            if (result && result.data) {
                setOrders(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        }
    }, []);

    const handleOnStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    };
    const handlePaymentStatusChange = async(orderId,newStatus)=>{
        try{
            
            const response = await orderService.updateOrderStatus(orderId,newStatus)
            if(response)
            {
                await fetchOrders()
            }
        }catch(e)
        {
            console.error(e)
        }
    }
    React.useEffect(()=>{
        fetchOrders(selectedStatus)
    },[selectedStatus, fetchOrders])

    return (
        
        <div>
            <div >
            <select 

                onChange={handleOnStatusChange}
                className="p-2 rounded-[2px]"
                name="paymentStatus" 
                id="paymentStatus"
                value ={selectedStatus}
                >
                <option value="" >
                    Payment status
                </option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                </select>
            </div>
          <div className="rounded-lg border bg-white shadow-sm mt-2"> 
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr 
                className="border-b bg-gray-50">
                  <th 
                  className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                    Order Id 
                  </th>
                  <th 
                  className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                    Total 
                  </th>
                  <th 
                  className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                    Created At 
    
                  </th>
                  <th 
                  className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                    Customer phone number 
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                    Customer name
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                    Payment status
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                    Shipping address
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr
                    onClick={()=>handleViewDetails(order.order_id)}
                    key={index}
                    className={`
                      border-b transition-colors hover:bg-blue-50/50
                      ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                    `}
                  >
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                   
                        <span className="font-medium text-gray-900">{order.order_id}</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle text-gray-600">
                      {order.total}
                    </td>
                    <td className="p-4 align-middle text-gray-600">
                      {format(new Date(order.created_at), 'PPp')}
                    </td>
                    <td className="p-4 align-middle text-gray-600">
                      {order.userPhoneNumber}
                    </td>
                    <td className="p-4 align-middle text-gray-600">
                      {order.userFullName}
                    </td>
                    <td className="p-4 align-middle text-gray-600">
                        <select
                            className={`
                            capitalize inline-flex rounded px-2 py-1 text-xs font-medium
                            ${order.paymentStatus === 'pending' 
                                ? 'bg-red-100 text-red-700' 
                                : 'bg-green-100 text-green-700'
                            }
                            `}
                            value={order.paymentStatus}
                            onChange={(e) => handlePaymentStatusChange(order.order_id, e.target.value)}
                        >
                            <option className='bg-red-100 text-red-700 ' value="pending">Pending</option>
                            <option className='bg-green-100 text-green-700' value="paid">Paid</option>
                        </select>
                        </td>
                    <td className="p-4 align-middle text-gray-600">
                      {order.shippingAddress}
                    </td>
                
                  </tr>
                ))}
    

              </tbody>
    
            </table>
          </div>
        </div>
        {selectedOrderId && (
        <OrderDetails
          orderId={selectedOrderId} 
          isOpen={dialogOpen}
          onClose={handleCloseDialog}
        />
      )}
        </div>
      )
}

export default OrderList 