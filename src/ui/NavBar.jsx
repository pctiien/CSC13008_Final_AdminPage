import NavBarItem from '../feature/NavBar/NavBarItem';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Avatar, AvatarImage, AvatarFallback } from "../components/Avatar"

import accountIcon from '@/assets/account.svg';
import productIcon from '@/assets/product.svg';
import categoryIcon from '@/assets/category.svg';
import manufacturerIcon from '@/assets/manufacturer.svg';
import orderIcon from '@/assets/order.svg';
import reportIcon from '@/assets/report.svg';

const NavBar = ({ isOpen }) => {
    const navigate = useNavigate();
    const {getUser} = useAuth();
    const user = getUser();
    const [navState, setNavState] = useState([
        {
            title: 'Account',
            redirect: '/account',
            icon: accountIcon,
        },
        {
            title: 'Product',
            icon: productIcon,
            subItems: [
                {
                    id: 1,
                    title: 'Product List',
                    ref: '/product'
                },
                {
                    id: 2,
                    title: 'Add Product',
                    ref: '/add-product'
                },
            ]
        },
        {
            title: 'Category',
            icon: categoryIcon,
            redirect: '/category',
            subItems: [ ]
        },
        {
            title: 'Manufacturer',
            icon: manufacturerIcon,
            redirect: '/manufacturer',
        },
        {
            title: 'Order',
            redirect: '/order',
            icon: orderIcon,
        },
        {
            title: 'Report',
            icon: reportIcon,
            subItems: [
                {
                    id: 1,
                    title: 'Revenue Product',
                    ref: '/revenue-product'
                },
                {
                    id: 2,
                    title: 'Top Revenue Product',
                    ref: '/top-revenue-product'
                },
            ]
        }
    ]);

    const [selectedItem, setSelectedItem] = useState(null);

    const handleClick = (index) => {
        if (selectedItem === index) return setSelectedItem(null);
        
        setSelectedItem(index);
        if ('redirect' in navState[index]) {
            navigate(navState[index].redirect ? navState[index].redirect : '/');
        }
    };

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
    

    return (
        <div
            className={`pl-4 pt-4 pr-4 fixed h-screen  ${isOpen ? 'translate-x-0 w-70' : '-translate-x-full w-16'} 
                transition-transform duration-300 ease-in-out z-50`}
        >
            <div className="flex flex-col justify-center w-full">
                <div className="flex items-center justify-center gap-4">
                    <div className="w-16 h-16">
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
                    {isOpen && (
                        <div className="flex flex-col hidden sm:block">
                            <div className="text-lg text-transparent bg-clip-text bg-gradient-to-r from-violet-800 to-pink-800">
                                {user.user_name}
                            </div>
                        </div>
                    )}
                </div>
                <hr className="border-t-2 border-gray-300 my-4" />

                <div className="flex flex-col gap-1">
                    {navState?.map((item, index) => {
                        return (
                            <div key={index} onClick={() => handleClick(index)}>
                                <NavBarItem
                                    isOpen={isOpen && selectedItem === index}
                                    title={navState[index].title}
                                    imgSrc={navState[index].icon}
                                    subItems={navState[index].subItems}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default NavBar;