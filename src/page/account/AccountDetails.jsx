'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/Dialog'
import { Avatar, AvatarImage, AvatarFallback } from "../../components/Avatar"
import React from "react"
import userService from '../../service/userService'
const AccountDetails = ({ userId,isOpen,onClose }) =>{

  const [user,setUser] = React.useState(null)
  const fetchUser = async()=>{
    const result = await userService.getUserDetails(userId)
    if(result.data.data)
    {
        setUser(result.data.data)
    }
  }
  React.useEffect(()=>{
    fetchUser()
  },[userId])

  // Get initials for avatar fallback
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  const isValidUrl = (str) => {
    try {
      new URL(str);  
      return true; 
    } catch (_) {
      return false;  
    }
  };

  if(!user) return null 

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="flex items-center justify-center">
            {/* <Avatar
              src={user.avatar}
              alt={user.user_name}
              fallback={getInitials(user.user_name)}
            /> */}
             <Avatar className="h-20 w-20">
            {
                isValidUrl(user.avatar)  ? (
                    <AvatarImage src={user.avatar} alt={user.user_name} />
                    ) : (
                    <AvatarFallback>
                        {getInitials(user.user_name)} 
                    </AvatarFallback>
                )
            }
            </Avatar>
          </div>
          <div className="grid gap-4">
            <div className="space-y-2">
              <h3 className="text-center text-2xl font-semibold">{user.user_name}</h3>
            </div>
            <div className="grid gap-3">
              <div className="flex items-center gap-3">
                <svg
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <svg
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="text-sm">{user.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <svg
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm">
                  Joined {formatDate(user.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AccountDetails