"use client"

import { useState,useEffect } from "react"
import { format } from "date-fns"
import { Avatar, AvatarImage, AvatarFallback } from "../../components/Avatar"
import { Switch } from "../../components/Switch"
import userService from '../../service/userService'
import Pagination from '../../components/Pagination'
import SearchBar from '../../components/SearchBar'
import {useSearchParams } from 'react-router-dom';
import AccountDetails from './AccountDetails'
import { toast, ToastContainer } from 'react-toastify';

function AccountList() {

  const [dialogOpen, setDialogOpen] = useState(false)
  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedUserId(null)
  }

  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([])

  const [selectedUserId, setSelectedUserId] = useState(null)
  const handleViewDetails = (userId,event)=>{
    if (event.target.closest('.switch-container')) {
      return;
    }
    setSelectedUserId(userId)
    setDialogOpen(true)

  }

  const [selectedPage, setSelectedPage] = useState(1)
  const onPageChange = (page)=>{
    setSelectedPage(page)
    setSearchParams(prev => {
      prev.set("page", page)
      return prev
    })
  }

  const [totalPage,setTotalPage] = useState(0)

  const [searchKey, setSearchKey] = useState(searchParams.get("search") || "")

  const [sortConfig, setSortConfig] = useState({
    field: searchParams.get("sortBy") || 'created_at', 
    direction: searchParams.get("sortOrder") || 'DESC'
  })
  

  const fetchUserData = async()=>{
    const result = await userService.getAllUsers(selectedPage,10,searchKey,sortConfig.field,sortConfig.direction)
    if(result.data)
    {
      setUsers(result.data.data)
      setTotalPage(result.data.totalPage)
    }
  }


  const handleSort = (field) => {

    const newDirection = sortConfig.field === field && sortConfig.direction === 'ASC' ? 'DESC' : 'ASC'

    setSortConfig(prevConfig => ({
      field,
      direction: newDirection
    }));

    setSelectedPage(1);

    setSearchParams(prev => {
      prev.set("sortBy", field)
      prev.set("sortOrder", newDirection)
      prev.set("page", 1)
      return prev
    })
  };

  useEffect(()=>{
    fetchUserData()
  },[selectedPage,searchKey,sortConfig])

  const handleSwitchClick = (event) => {
    event.stopPropagation();  
  }
  const toggleBan = async(userId) => {
    try{

      const result = await userService.toggleBanUser(userId)
      if(!result || result.err)
      {
        toast.error(result.err.response.data.message, { autoClose: 2000 });
      }
      else{
        toast.success('Ban successfully', { autoClose: 2000 });

        fetchUserData()

      }

    }catch(err)
    {
      console.error(err)

    }
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
  const onSearchInputChange = (value)=>{
    setSearchKey(value)

    setSearchParams(prev => {
      prev.set("search", value)
      return prev
    })

  }
  return (

    <div>
      <ToastContainer/>
      <SearchBar onChange={onSearchInputChange} placeHolder ="Filter by name or email..."></SearchBar>
      <div className="rounded-lg border bg-white shadow-sm mt-2"> 
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th 
              onClick={()=>handleSort('user_name')}
              className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                User name {sortConfig.field === 'user_name' && (sortConfig.direction === 'ASC' ? '▲' : '▼')}
              </th>
              <th 
              onClick={() => handleSort('email')}
              className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                Email {sortConfig.field === 'email' && (sortConfig.direction === 'ASC' ? '▲' : '▼')}

              </th>
              <th 
              onClick={() => handleSort('created_at')}
              className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                Registration Time {sortConfig.field === 'created_at' && (sortConfig.direction === 'ASC' ? '▲' : '▼')}
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                onClick={() => handleViewDetails(user.user_id,event)}
                key={index}
                className={`
                  border-b transition-colors hover:bg-blue-50/50
                  ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                `}
              >
                <td className="p-4 align-middle">
                  <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
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
                    <span className="font-medium text-gray-900">{user.user_name}</span>
                  </div>
                </td>
                <td className="p-4 align-middle text-gray-600">
                  {user.email}
                </td>
                <td className="p-4 align-middle text-gray-600">
                  {format(new Date(user.created_at), 'PPp')}
                </td>
                <td className="p-4 align-middle">
                  <div 
                  onClick={handleSwitchClick}
                  className="flex items-center gap-2 switch-container">
                    <Switch
                      checked={user.is_banned}
                      onCheckedChange={() => {
                        toggleBan(user.user_id);  
                      }}
                      aria-label={`Ban ${user.user_name}`}
                    />
                    <span 
                      className={`
                        inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                        ${user.is_banned 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-green-100 text-green-700'
                        }
                      `}
                    >
                      {user.is_banned ? "Banned" : "Active"}
                    </span>
                  </div>
                </td>
              </tr>
            ))}

          </tbody>

        </table>
      <Pagination onPageChange={onPageChange} currentPage={selectedPage} totalPage={totalPage} limit={10}></Pagination>
      </div>
    </div>
    {selectedUserId && (
        <AccountDetails
          userId={selectedUserId} 
          isOpen={dialogOpen}
          onClose={handleCloseDialog}
        />
      )}
    </div>
  )
}

export default AccountList

