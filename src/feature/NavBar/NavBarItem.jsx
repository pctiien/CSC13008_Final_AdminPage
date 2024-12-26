import React from 'react'
import {Link} from 'react-router-dom'
import { useNavBarItemContext } from '../../context/NavBarItemContext' 
const NavBarItem = ({isOpen,title,imgSrc,subItems})=>{

    const { selectedItem, setSelectedItem } = useNavBarItemContext(); 

    const handleClick = (e,index)=>{
        e.stopPropagation()
        setSelectedItem(index)
    }

    return (
        <>
            <div className='' >
                <div 
                className={`font-medium  hover:bg-custom-pink-1 cursor-pointer flex gap-2 px-2 rounded-sm  py-3 items-center group ${isOpen ? 'bg-custom-pink-1 text-custom-pink-2 ' :'text-gray-500'}`}>
                    <img className="w-6 h-6" src={imgSrc} alt="" />
                    <h1 className=" text-lg overflow-x-hidden  max-sm:hidden group-hover:text-custom-pink-2 ">{title}</h1>
                </div>
                <div className = {` ${ isOpen ? 'opacity-100 visible' : 'hidden'} max-sm:hidden `}>
                <ul className='list-disc list-inside '>
                    {
                        subItems && subItems.length >0 && subItems.map((item, index) => {
                            return (
                                <li 
                                    onClick={(e) => handleClick(e, index)}
                                    key={index}
                                    className={`p-1 mt-1 hover:bg-custom-pink-1 hover:text-custom-pink-2 text-gray-500 text-base cursor-pointer`}>
                                    <Link to={item.ref}>
                                        {item.title}
                                    </Link>             
                                </li>
                            );
                        })
                    }
                </ul>

                </div>
            </div>
        </>
    )
}
export default NavBarItem