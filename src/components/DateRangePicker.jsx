import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export function DateRangePicker({ startDate, endDate, onStartDateChange, onEndDateChange }) {
    React.useEffect(() => {
      if (startDate && endDate) {
        onStartDateChange(startDate)  // Nếu cần thiết có thể gọi khi startDate thay đổi
      }
    }, []);
  
    return (
      <div className='flex gap-2 '>
        <DatePicker
          className='rounded-sm p-2'
          selected={startDate}
          onChange={(date) => onStartDateChange(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          isClearable
          placeholderText="Start Date"
        />
        <DatePicker
          className='rounded-sm p-2'
          selected={endDate}
          onChange={(date) => onEndDateChange(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          isClearable
          placeholderText="End Date"
          minDate={startDate}
        />
      </div>
    )
  }