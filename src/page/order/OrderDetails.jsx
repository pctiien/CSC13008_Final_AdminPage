'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/Dialog'
import { Avatar, AvatarImage, AvatarFallback } from "../../components/Avatar"

import React from "react"
import orderService from '../../service/orderService'
const OrderDetails = ({ orderId,isOpen,onClose }) =>{

  const [order,setOrder] = React.useState(null)
  const fetchUser = async()=>{
    const result = await orderService.getOrderDetails(orderId)
    if(result.data.data)
    {
        setOrder(result.data.data)
    }
  }
  React.useEffect(()=>{
    fetchUser()
  },[orderId])



  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }
  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  const isValidUrl = (str) => {
    try {
      new URL(str);  
      return true; 
    } catch (_) {
      return false;  
    }
  };


  if(!order) return null 

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="flex items-center justify-center">
          </div>
          <div className="grid gap-4">
           
            <div className="grid gap-3">
            <table>
                <thead>
                    <tr className="border-b bg-gray-50">
                    <th 
                    className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                        Product 
                    </th>
                    <th 
                    className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                        Quantity 

                    </th>
                    <th 
                    className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                        Total
                    </th>
                
                    </tr>
            </thead>
            {
                order.OrderDetails && order.OrderDetails.map((od,index)=>{
                    return (
                        <tr
                            key={index}
                            className={`border-b transition-colors hover:bg-blue-50/50
                            ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                            `}
                            >
                            <td className="p-4 align-middle">
                                <div className="flex items-center gap-3">
                                          <Avatar className="h-9 w-9">
                                            {
                                                isValidUrl(od.Product.img)  ? (
                                                <AvatarImage src={od.Product.img} alt={od.Product.product_name} />
                                                ) : (
                                                <AvatarFallback>
                                                    {getInitials(od.Product.product_name)} 
                                                </AvatarFallback>
                                                )
                                            }
                                            </Avatar>
                                            <span className="font-medium text-gray-900">{od.Product.product_name}</span>
                                          </div>
                                        </td>
                                        <td className="p-4 align-middle text-gray-600">
                                          {od.quantity}
                                        </td>
                                        <td className="p-4 align-middle text-gray-600">
                                          {od.total}
                                        </td>
                                       
                                    
                                      </tr>
                    )
                })
              }
            </table>
              
              
             
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default OrderDetails