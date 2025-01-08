import { useState } from "react"
import {useAuth} from '../../hooks/useAuth'
import userService from '../../service/userService'
import { toast, ToastContainer } from 'react-toastify';

export default function AdminProfile() {
  const {getUser,userLogin} = useAuth()
  const user = getUser()
  const [userName, setUserName] = useState(user.user_name)
  const [phone, setPhone] = useState(user.phone)
  const handleUserNameChange = (e) => setUserName(e.target.value)
  const handlePhoneChange = (e) => setPhone(e.target.value)

  const handleSaveChange = async () => {
    try {
      const updatedUser = {
        user_name: userName,
        phone: phone
      }

      const result = await userService.updateProfile(updatedUser)
      if(result && result.data && result.data.success == true)
      {
        userLogin(result.data.data)
        toast.success('Profile updated successful!', { autoClose: 2000 });

      }else{
        toast.error('Profile updated failed!', { autoClose: 2000 });

        console.log('Profile updated failed')

      }
    
    } catch (err) {
      console.error('Error while saving profile:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <ToastContainer/>
      <div className="mx-auto max-w-4xl space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-500">Manage your account settings and preferences</p>
        </div>



        {/* Personal Details Section */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Personal Details</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                User Name
              </label>
              <input
                onChange={handleUserNameChange}
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                value={userName}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input readOnly disabled
                value={user.email}
                type="email"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                onChange={handlePhoneChange}
                value={phone}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
        </div>

        
      
        {/* Save Button */}
        <div className="flex justify-end">
          <button 
          onClick={handleSaveChange}
          className="bg-black rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
            Save Changes
          </button>
        </div>

      </div>
    </div>
  )
}

