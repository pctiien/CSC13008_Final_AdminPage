import React from 'react';
import {ChevronLeftIcon,ChevronRightIcon} from '../../src/components/ChevronIcon'
const Pagination = ({totalPage,limit,currentPage,onPageChange})=>{

    const pageCount = 3 
    

    const handleChange = (page)=>{
        if(page>=1 && page<=totalPage)
        {
            onPageChange(page)
        }
    }
    const pageNumbers = React.useMemo(() => {
        const delta = 1 
        const range = []
        const rangeWithDots = []
    
        let left = currentPage - delta
        let right = currentPage + delta
    
        if (left < 1) {
          right = Math.min(right + (1 - left), totalPage)
          left = 1
        }
        if (right > totalPage) {
          left = Math.max(left - (right - totalPage), 1)
          right = totalPage
        }
    
        for (let i = left; i <= right; i++) {
          range.push(i)
        }
    
        if (left > 1) {
          rangeWithDots.push(1)
          if (left > 2) rangeWithDots.push('...')
        }
    
        rangeWithDots.push(...range)
    
        if (right < totalPage) {
          if (right < totalPage - 1) rangeWithDots.push('...')
          rangeWithDots.push(totalPage)
        }
    
        return rangeWithDots
      }, [currentPage, totalPage])
    

    const startEntry = (currentPage - 1) * limit + 1
    const endEntry = Math.min(currentPage * limit, totalPage * limit)
    const totalEntries = totalPage * limit
    
    return (
        <>
            <div className='flex py-6 px-6 pt-10 justify-between items-center'>
            <p className="text-sm text-gray-600">
                Showing <span className="font-medium">{startEntry}</span> to{" "}
                <span className="font-medium">{endEntry}</span> of{" "}
                <span className="font-medium">{totalEntries}</span> entries
            </p>
                <div className='flex items-center gap-3'>
                    <div 
                    onClick={()=>handleChange(currentPage-1)}
                    className='hover:text-white hover:bg-blue-500 w-10  h-10 border text-black text-lg font-semibold flex items-center justify-center rounded-full'>
                        <ChevronLeftIcon></ChevronLeftIcon>

                    </div>
                    <div className="flex items-center gap-2">
                        {pageNumbers.map((pageNumber, index) => (
                            pageNumber === '...' ? (
                            <span
                                key={`dots-${index}`}
                                className="w-10 text-center text-gray-500"
                                aria-hidden="true"
                            >
                                {pageNumber}
                            </span>
                            ) : (
                            <div 
                            onClick={() => onPageChange(pageNumber)}
                            key={index} className  ={`hover:text-white hover:bg-blue-500 w-10 h-10   text-lg font-semibold flex items-center justify-center rounded-full ${currentPage===pageNumber ?'bg-blue-500 text-white' :'text-black'}`}>{pageNumber}
                            </div>
                          
                            )
                        ))}
                    </div>
                    <div
                    onClick={()=>handleChange(currentPage+1)} 
                    aria-label="Next page"
                    className='hover:text-white hover:bg-blue-500 w-10 h-10 border text-black text-lg font-semibold flex items-center justify-center rounded-full'>
                        <ChevronRightIcon></ChevronRightIcon>

                    </div>
                </div>
            </div>
        </>
    )
}
export default Pagination 