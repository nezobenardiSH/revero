'use client'

import { useState, useEffect } from 'react'

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
    partySize: 4
  })

  const handleInputChange = (field: keyof BookingFormData, value: string | number) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
  }

  const handleContinue = () => {
    if (formData.date && formData.time && formData.partySize) {
      onAvailabilityCheck(formData)
    }
  }

  const decrementGuests = () => {
    if (formData.partySize > 1) {
      handleInputChange('partySize', formData.partySize - 1)
    }
  }

  const incrementGuests = () => {
    if (formData.partySize < 8) {
      handleInputChange('partySize', formData.partySize + 1)
    }
  }

  const getDateOptions = () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const dayAfter = new Date(tomorrow)
    dayAfter.setDate(dayAfter.getDate() + 1)
    
    const dayAfter2 = new Date(dayAfter)
    dayAfter2.setDate(dayAfter2.getDate() + 1)
    
    return [
      { 
        label: 'Today', 
        subLabel: today.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        value: today.toISOString().split('T')[0] 
      },
      { 
        label: 'Mon', 
        subLabel: tomorrow.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        value: tomorrow.toISOString().split('T')[0] 
      },
      { 
        label: 'Tue', 
        subLabel: dayAfter.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        value: dayAfter.toISOString().split('T')[0] 
      },
      { 
        label: 'Wed', 
        subLabel: dayAfter2.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        value: dayAfter2.toISOString().split('T')[0] 
      }
    ]
  }

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00', '20:30',
    '21:00', '21:30', '22:00', '22:30'
  ]

  useEffect(() => {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0]
    setFormData(prev => ({ ...prev, date: today }))
  }, [])

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <button className="mr-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-semibold flex-1 text-center">Book a Table</h2>
      </div>
      
      {/* Guest Counter */}
      <div className="mb-6">
        <label className="block text-gray-600 mb-3">Guests</label>
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={decrementGuests}
            disabled={formData.partySize <= 1}
            className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center disabled:bg-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="text-3xl font-light min-w-[60px] text-center">{formData.partySize}</span>
          <button
            onClick={incrementGuests}
            disabled={formData.partySize >= 8}
            className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center disabled:bg-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Date Selection */}
      <div className="mb-6">
        <label className="block text-gray-600 mb-3">Date</label>
        <div className="grid grid-cols-4 gap-2">
          {getDateOptions().map((option) => (
            <button
              key={option.value}
              onClick={() => handleInputChange('date', option.value)}
              className={`py-3 px-2 rounded-full text-center transition-colors ${
                formData.date === option.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="text-sm font-medium">{option.label}</div>
              <div className="text-xs opacity-75">{option.subLabel}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Time Grid */}
      <div className="mb-8">
        <label className="block text-gray-600 mb-3">Time</label>
        <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
          {timeSlots.map((slot) => (
            <button
              key={slot}
              onClick={() => handleInputChange('time', slot)}
              className={`py-3 rounded-lg text-sm font-medium transition-colors ${
                formData.time === slot
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        disabled={!formData.date || !formData.time || isLoading}
        className="w-full py-4 bg-purple-600 text-white rounded-full font-medium text-lg disabled:bg-gray-300 disabled:text-gray-500 transition-colors hover:bg-purple-700"
      >
        {isLoading ? 'Checking availability...' : 'Continue'}
      </button>
    </div>
  )
}