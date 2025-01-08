import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../service/authService'
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import { Avatar, AvatarImage, AvatarFallback } from "../components/Avatar"
const Header = ({ toggleNavBar, isNavBarOpen }) => {
    const navigate = useNavigate();

    const { getUser,userLogout } = useAuth();
    const user = getUser()

    const isValidUrl = (str) => {
        try {
          new URL(str);  
          return true; 
        } catch (_) {
          return false;  
        }
      };
    const getInitials = (name) => {
        return name
          .split(' ')
          .map(word => word[0])
          .join('')
          .toUpperCase()
      }
    const handleLogOut = async() => {

        const result = await authService.logOut() 

        if(result)
        {
            console.log(result)
        }

        toast.success('Logout successful!', { autoClose: 2000 });
        setTimeout(() => {
            userLogout();
            navigate('/'); 
        }, 1500);

    }
    
    return (
        <div className=" w-full bg-gray-50 z-50 fixed block  ">
            <div className=" flex justify-start items-center py-2 ">
                <div>
                    {/* Toggle NavBar Button */}
                    <button
                        onClick={toggleNavBar}
                        className="bg-gradient-to-r from-violet-500 to-pink-500 hover:bg-gradient-to-r hover:from-violet-700 hover:to-pink-700 focus:outline-dashed focus:outline-2 focus:outline-violet-500 cursor-pointer px-2 py-1.5 rounded-md mr-4 ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white feather feather-menu">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div className="">
                    <a href="/" className="focus:outline-dashed focus:outline-2 focus:outline-violet-500 cursor-pointer font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-violet-800 to-pink-800 mr-8">
                        Cara Shop
                    </a>
                </div>
                <div>
                </div>
                
                <div className="flex-1 flex items-center fixed right-0">
                   
                    <div className="flex items-center gap-2 mr-4">
                        <button 
                        onClick={handleLogOut}
                        className="focus:outline-dashed focus:outline-2 focus:outline-violet-500 cursor-pointer px-3 py-2 rounded-md text-white bg-gradient-to-r from-violet-500 to-pink-500 hover:bg-gradient-to-r hover:from-violet-700 hover:to-pink-700 "
                         
                         >
                            Log out
                        </button>
                        <div className="w-10 h-10 ">
                           <Avatar className="h-full w-full">
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
                        <span className="text-gray-600 bg-clip-text hover:bg-gradient-to-r hover:from-violet-800 hover:to-pink-800 hover:text-transparent">
                            {user?.user_name}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;