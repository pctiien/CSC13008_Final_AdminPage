"use client"

import { useState,useEffect } from "react"
import { format } from "date-fns"
import { Avatar, AvatarImage, AvatarFallback } from "../../components/Avatar"
import { Switch } from "../../components/Switch"
import userService from '../../service/userService'
import Pagination from '../../components/Pagination'
import SearchBar from '../../components/SearchBar'

function AccountList() {
  const [users, setUsers] = useState([])


  const [selectedPage, setSelectedPage] = useState(1)
  const onPageChange = (page)=>{
    setSelectedPage(page)
  }

  const [totalPage,setTotalPage] = useState(0)

  const [searchKey,setSearchKey] = useState('')

  const [sortConfig, setSortConfig] = useState({
    field: 'created_at', 
    direction: 'DESC'
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
    setSortConfig(prevConfig => ({
      field,
      direction: prevConfig.field === field && prevConfig.direction === 'ASC' ? 'DESC' : 'ASC'
    }));
    setSelectedPage(1);
  };

  useEffect(()=>{
    fetchUserData()
  },[selectedPage,searchKey,sortConfig])


  const toggleBan = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, banned: !user.banned } : user
    ))
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
    console.log(value)
    setSearchKey(value)
  }
  return (

    <div>
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
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={user.banned}
                      onCheckedChange={() => toggleBan(user.id)}
                      aria-label={`Ban ${user.user_name}`}
                    />
                    <span 
                      className={`
                        inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                        ${user.banned 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-green-100 text-green-700'
                        }
                      `}
                    >
                      {user.banned ? "Banned" : "Active"}
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
    </div>
  )
}

export default AccountList

