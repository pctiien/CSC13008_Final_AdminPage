import NavBarItem from '../feature/NavBar/NavBarItem';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const NavBar = ({ isOpen }) => {
    const navigate = useNavigate();

    const [navState, setNavState] = useState([
        {
            title: 'Account',
            icon: 'src/assets/account.svg',
            subItems: [
                {
                    id: 1,
                    title: 'Account List',
                    ref: '/'
                },
                {
                    id: 2,
                    title: 'Account Details',
                    ref: '/account-details'
                },
            ],
        },
        {
            title: 'Product',
            icon: '/src/assets/product.svg',
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
            icon: '/src/assets/category.svg',
            redirect: '/category',
            subItems: [ ]
        },
        {
            title: 'Manufacturer',
            icon: '/src/assets/manufacturer.svg',
            redirect: '/manufacturer',
        },
        {
            title: 'Order',
            redirect: '/order',
            icon: '/src/assets/order.svg',
        },
        {
            title: 'Report',
            icon: '/src/assets/report.svg',
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

    return (
        <div
            className={`pl-4 pt-4 pr-4 fixed h-screen ${isOpen ? 'translate-x-0 w-70' : '-translate-x-full w-16'} 
                transition-transform duration-300 ease-in-out z-50`}
        >
            <div className="flex flex-col justify-center">
                <div className="flex items-center justify-center gap-4">
                    <div className="w-16 h-16">
                        <img
                            className="rounded-full"
                            src="https://hotelair-react.pixelwibes.in/static/media/profile_av.387360c31abf06d6cc50.png"
                            alt="avatar"
                        />
                    </div>
                    {isOpen && (
                        <div className="flex flex-col">
                            <div className="text-lg text-transparent bg-clip-text bg-gradient-to-r from-violet-800 to-pink-800">
                                Anny Glover
                            </div>
                            <span className="text-base text-gray-500"> Super Admin</span>
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