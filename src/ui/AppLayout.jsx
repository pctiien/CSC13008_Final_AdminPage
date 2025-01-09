import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import NavBar from './NavBar';

const AppLayout = () => {
    const [isNavBarOpen, setIsNavBarOpen] = useState(true);

    const toggleNavBar = () => {
        setIsNavBarOpen(!isNavBarOpen);
    };

    return (
        <div className={`flex font-dm-sans bg-gradient-to-b from-gray-50 to-custom-gray h-screen min-h-screen ${isNavBarOpen ? 'gap-12' : 'gap-4'}`}>
            <NavBar isOpen={isNavBarOpen} />
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isNavBarOpen ? 'ml-24 sm:ml-64' : 'ml-16' }`}>
                <Header toggleNavBar={toggleNavBar} isNavBarOpen={isNavBarOpen} />
                <div className="overflow-auto h-full px-2 pt-16 ">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AppLayout;