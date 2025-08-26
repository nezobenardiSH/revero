'use client'

import { useState } from 'react'

interface BookingFormData {
  date: string
  time: string
  partySize: number
}

interface BookingFormProps {
  onAvailabilityCheck: (data: BookingFormData) => void
  isLoading: boolean
}

export default function BookingForm({ onAvailabilityCheck, isLoading }: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    date: '',
    time: '',
    partySize: 2
  })

  const handleInputChange = (field: keyof BookingFormData, value: string | number) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    
    if (newData.date && newData.time && newData.partySize) {
      onAvailabilityCheck(newData)
    }
  }

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Book a Table</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            min={getTomorrowDate()}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time
          </label>
          <select
            value={formData.time}
            onChange={(e) => handleInputChange('time', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select time</option>
            <option value="17:00">5:00 PM</option>
            <option value="17:30">5:30 PM</option>
            <option value="18:00">6:00 PM</option>
            <option value="18:30">6:30 PM</option>
            <option value="19:00">7:00 PM</option>
            <option value="19:30">7:30 PM</option>
            <option value="20:00">8:00 PM</option>
            <option value="20:30">8:30 PM</option>
            <option value="21:00">9:00 PM</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Party Size
          </label>
          <select
            value={formData.partySize}
            onChange={(e) => handleInputChange('partySize', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(size => (
              <option key={size} value={size}>
                {size} {size === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && (
        <div className="mt-4 text-center text-gray-600">
          Checking availability...
        </div>
      )}
    </div>
  )
}