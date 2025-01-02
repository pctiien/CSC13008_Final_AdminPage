import { Button } from '../../components/Button'

export function TimeRangeSelector({ selectedRange, onRangeChange }) {
  const timeRanges = ['day', 'week', 'month']

  return (
    <div className="flex space-x-2">
      {timeRanges.map((range) => (
        <Button
          key={range}
          variant={selectedRange === range ? 'default' : 'secondary'}
          onClick={() => onRangeChange(range)}
        >
          {range.charAt(0).toUpperCase() + range.slice(1)}
        </Button>
      ))}
    </div>
  )
}

