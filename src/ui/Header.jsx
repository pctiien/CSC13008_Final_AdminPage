import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Header = ({ toggleNavBar, isNavBarOpen }) => {



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
                <div
                    className={`transition-all duration-300 ease-in-out ${isNavBarOpen ? 'w-1/2' : 'w-2/3'
                        } flex items-center px-4 bg-white text-gray-500 py-2 border border-gray-300 rounded-md`}>
                    <svg
                        className="svg-stroke search-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                        <path d="M21 21l-6 -6"></path>
                    </svg>
                    <input
                        className="w-full outline-none"
                        type="text"
                        placeholder="Search..."
                    />
                </div>
                <div className="flex-1 flex items-center fixed right-0">
                    <div className="px-4">
                        <svg
                            className="w-8 h-8"
                            xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"></path><path d="M9 17v1a3 3 0 0 0 6 0v-1"></path><path d="M21 6.727a11.05 11.05 0 0 0 -2.794 -3.727"></path><path d="M3 6.727a11.05 11.05 0 0 1 2.792 -3.727"></path></svg>
                    </div>
                    <div className="flex items-center gap-2 mr-4">
                      
                        <div className="w-10 h-10 ">
                            <img className="rounded-full hover:shadow-lg"
                                src="https://hotelair-react.pixelwibes.in/static/media/profile_av.387360c31abf06d6cc50.png" alt="" />
                        </div>
                        <span className="text-gray-600 bg-clip-text hover:bg-gradient-to-r hover:from-violet-800 hover:to-pink-800 hover:text-transparent">
                            Michelle
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;