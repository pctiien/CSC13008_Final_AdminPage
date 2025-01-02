import { useState } from 'react'

export function Calendar({ mode = 'single', selected, onSelect, numberOfMonths = 1 }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [rangeStart, setRangeStart] = useState(null)

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const days = new Date(year, month + 1, 0).getDate()
    const firstDay = new Date(year, month, 1).getDay()
    return { days, firstDay }
  }

  const formatDay = (year, month, day) => {
    return new Date(year, month, day)
  }

  const isSelected = (date) => {
    if (!selected) return false
    if (mode === 'range') {
      if (selected.from && selected.to) {
        return date >= selected.from && date <= selected.to
      }
      if (rangeStart) {
        return date.getTime() === rangeStart.getTime()
      }
    }
    return date.toDateString() === selected?.toDateString()
  }

  const isInRange = (date) => {
    if (mode !== 'range' || !rangeStart || !selected) return false
    const end = selected.to || date
    return date > rangeStart && date < end
  }

  const handleDateClick = (date) => {
    if (mode === 'range') {
      if (!rangeStart) {
        setRangeStart(date)
        onSelect({ from: date, to: null })
      } else {
        if (date < rangeStart) {
          onSelect({ from: date, to: rangeStart })
        } else {
          onSelect({ from: rangeStart, to: date })
        }
        setRangeStart(null)
      }
    } else {
      onSelect(date)
    }
  }

  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() - 1)
      return newDate
    })
  }

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + 1)
      return newDate
    })
  }

  const renderMonth = (monthOffset = 0) => {
    const date = new Date(currentMonth)
    date.setMonth(date.getMonth() + monthOffset)
    const { days, firstDay } = getDaysInMonth(date)
    const year = date.getFullYear()
    const month = date.getMonth()

    return (
      <div key={monthOffset} className="p-4">
        <div className="flex items-center justify-between mb-4">
          {monthOffset === 0 && (
            <button
              onClick={handlePrevMonth}
              className="p-1 hover:bg-accent rounded-full"
            >
              ←
            </button>
          )}
          <div className="text-center font-semibold">
            {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </div>
          {monthOffset === numberOfMonths - 1 && (
            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-accent rounded-full"
            >
              →
            </button>
          )}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center text-sm py-1 text-muted-foreground">
              {day}
            </div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: days }).map((_, i) => {
            const date = formatDay(year, month, i + 1)
            const isSelectedDay = isSelected(date)
            const isRangeDay = isInRange(date)
            
            return (
              <button
                key={i}
                onClick={() => handleDateClick(date)}
                className={`
                  p-2 text-sm rounded-lg transition-colors
                  hover:bg-accent hover:text-accent-foreground
                  ${isSelectedDay ? 'bg-primary text-primary-foreground' : ''}
                  ${isRangeDay ? 'bg-accent text-accent-foreground' : ''}
                `}
              >
                {i + 1}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="inline-block bg-background border rounded-lg shadow-lg">
      <div className="flex">
        {Array.from({ length: numberOfMonths }).map((_, i) => renderMonth(i))}
      </div>
    </div>
  )
}

