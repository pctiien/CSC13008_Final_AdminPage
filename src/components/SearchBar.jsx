import React from 'react';
export default function SearchBar({placeHolder,onChange}){
    
    const [value, setValue] = React.useState("")
    const handleInputChange = (event)=>{
        const newValue = event.target.value
        setValue(newValue)
        onChange(newValue)
    }
    return (
        <div
            className={`transition-all duration-300 ease-in-out flex items-center px-4 bg-white text-gray-500 py-2 border border-gray-300 rounded-md`}>
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
                value= {value}
                onChange= {handleInputChange}
                className="w-full outline-none"
                type="text"
                placeholder={placeHolder}
            />
        </div>
    )
}