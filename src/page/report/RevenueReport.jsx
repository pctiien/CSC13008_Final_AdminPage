'use client'

import { useState, useEffect } from 'react'
import { TimeRangeSelector } from './TimeRangeSelector'
import { DateRangePicker } from '../../components/DateRangePicker'
import { RevenueDisplay } from './RevenueDisplay'
import reportService from '../../service/reportService'


export default function RevenueReport() {
  const [timeRange, setTimeRange] = useState('day')
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),  
    endDate: new Date(),  
  })
  const [revenueData, setRevenueData] = useState([])
  const setEndDate = (endDate)=>{
    setDateRange({...dateRange,endDate})
  }
  const setStartDate = (startDate)=>{
    setDateRange({...dateRange,startDate})
  }
  const fetchReportDate = async()=>{
    const result = await reportService.getRevenueReport(timeRange, new Date(dateRange.startDate), new Date(dateRange.endDate))
    if(result && result.data && result.data )
    {
      setRevenueData(result.data.data)
    }
  }
  useEffect(() => {

    console.log('Fetching data for:', dateRange)
    fetchReportDate()
  }, [timeRange, dateRange])

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-center">
            <TimeRangeSelector
            selectedRange={timeRange}
            onRangeChange={setTimeRange}
            />
            <DateRangePicker
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            />
      </div>

      <RevenueDisplay  data={revenueData} />
    </div>
  )
}

