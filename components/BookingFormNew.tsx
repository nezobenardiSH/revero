'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface BookingFormData {
  date: string
  time: string
  partySize: number
  name: string
  email: string
  tableId: number | null
  occasion?: string
  children?: number
}

interface BookingFormProps {
  onReservationSubmit: (data: BookingFormData) => void
  isLoading: boolean
}

interface TableDetails {
  id: number
  x: number
  y: number
  seats: number
  large?: boolean
  name: string
  description: string
  image: string
  features: string[]
}

export default function BookingFormNew({ onReservationSubmit, isLoading }: BookingFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<BookingFormData>({
    date: '',
    time: '12:00 PM',
    partySize: 2,
    name: '',
    email: '',
    tableId: null,
    occasion: '',
    children: 0
  })

  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [floorNumber, setFloorNumber] = useState<number>(1)
  const [showTableModal, setShowTableModal] = useState(false)
  const [selectedTableDetails, setSelectedTableDetails] = useState<TableDetails | null>(null)

  const handleInputChange = (field: keyof BookingFormData, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSubmit = () => {
    if (formData.date && formData.time && formData.tableId && formData.name && formData.email) {
      onReservationSubmit(formData)
    }
  }

  // Calendar logic
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    return days
  }

  const isToday = (day: number) => {
    const today = new Date()
    return day === today.getDate() && 
           currentMonth.getMonth() === today.getMonth() && 
           currentMonth.getFullYear() === today.getFullYear()
  }

  const isPastDate = (day: number) => {
    if (!day) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dateToCheck = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    dateToCheck.setHours(0, 0, 0, 0)
    return dateToCheck < today
  }

  const selectDate = (day: number) => {
    if (!day || isPastDate(day)) return
    const year = currentMonth.getFullYear()
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0')
    const dayStr = String(day).padStart(2, '0')
    handleInputChange('date', `${year}-${month}-${dayStr}`)
  }

  const isSelected = (day: number) => {
    if (!day || !formData.date) return false
    const [year, month, dayStr] = formData.date.split('-').map(Number)
    return day === dayStr && 
           currentMonth.getMonth() === (month - 1) && 
           currentMonth.getFullYear() === year
  }

  const changeMonth = (direction: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1))
  }

  // Floor plan tables with details
  const tables: Record<number, TableDetails[]> = {
    1: [
      { 
        id: 1, x: 20, y: 20, seats: 2,
        name: "Romantic Corner",
        description: "Perfect intimate table for two with a view of the garden",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
        features: ["Garden View", "Quiet Area", "Candlelit"]
      },
      { 
        id: 2, x: 60, y: 20, seats: 4,
        name: "Family Table",
        description: "Comfortable seating for small families",
        image: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=400&h=300&fit=crop",
        features: ["Near Kitchen", "High Chairs Available", "Kids Menu"]
      },
      { 
        id: 3, x: 20, y: 50, seats: 4,
        name: "Business Meeting",
        description: "Quiet corner perfect for business discussions",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
        features: ["Power Outlets", "WiFi Zone", "Privacy Screen"]
      },
      { 
        id: 4, x: 60, y: 50, seats: 6,
        name: "Group Dining",
        description: "Spacious table for friend gatherings",
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop",
        features: ["Central Location", "Extra Space", "Group Menu"]
      },
      { 
        id: 5, x: 40, y: 35, seats: 8, large: true,
        name: "Celebration Table",
        description: "Large round table perfect for celebrations",
        image: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=400&h=300&fit=crop",
        features: ["Premium Location", "Decoration Ready", "Complimentary Cake Stand"]
      },
    ],
    2: [
      { 
        id: 6, x: 25, y: 25, seats: 2,
        name: "Window Seat",
        description: "Cozy table by the window with street view",
        image: "https://images.unsplash.com/photo-1581349437898-cebbe9831942?w=400&h=300&fit=crop",
        features: ["Street View", "Natural Light", "People Watching"]
      },
      { 
        id: 7, x: 55, y: 25, seats: 4,
        name: "Corner Booth",
        description: "Comfortable booth seating for four",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
        features: ["Booth Seating", "Privacy", "USB Charging"]
      },
      { 
        id: 8, x: 25, y: 55, seats: 4,
        name: "Artist's Table",
        description: "Decorated with local artwork",
        image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=400&h=300&fit=crop",
        features: ["Art Display", "Mood Lighting", "Instagram Worthy"]
      },
      { 
        id: 9, x: 55, y: 55, seats: 2,
        name: "Date Night",
        description: "Romantic setting for special occasions",
        image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop",
        features: ["Romantic Ambiance", "Wine Selection", "Desert Menu"]
      },
    ],
    3: [
      { 
        id: 10, x: 30, y: 30, seats: 6,
        name: "VIP Section",
        description: "Exclusive area with premium service",
        image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop",
        features: ["VIP Service", "Priority Booking", "Complimentary Appetizer"]
      },
      { 
        id: 11, x: 50, y: 50, seats: 4,
        name: "Chef's Table",
        description: "Watch the chef prepare your meal",
        image: "https://images.unsplash.com/photo-1564759298141-cef86f51d4d4?w=400&h=300&fit=crop",
        features: ["Kitchen View", "Chef Interaction", "Tasting Menu"]
      },
    ],
    4: [
      { 
        id: 12, x: 40, y: 40, seats: 10, large: true,
        name: "Party Table",
        description: "Perfect for large groups and parties",
        image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop",
        features: ["Large Group", "Sound System Access", "Party Packages"]
      },
    ]
  }

  const handleTableClick = (table: TableDetails) => {
    setSelectedTableDetails(table)
    setShowTableModal(true)
  }

  const selectTable = () => {
    if (selectedTableDetails) {
      handleInputChange('tableId', selectedTableDetails.id)
      setShowTableModal(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  const timeSlots = ['11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM']

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Make a reservation</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-[30%_70%] gap-8 items-start">
        {/* Left Column - Party Details */}
        <div className="space-y-6">
          {/* Party Name */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Party name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Your name here"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Email address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Igveen"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <p className="text-xs text-gray-500 mt-1">Enter a valid email address</p>
          </div>

          {/* Date Calendar */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Date & month</label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={formData.date ? new Date(formData.date + 'T00:00:00').toLocaleDateString() : '2025 / JUL / 25'}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="text-gray-600 hover:text-orange-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 className="font-semibold">
                  {currentMonth.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </h3>
                <button onClick={() => changeMonth(1)} className="text-gray-600 hover:text-orange-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                  <div key={day} className="font-semibold text-gray-600 py-2">{day}</div>
                ))}
                {getDaysInMonth().map((day, index) => (
                  <button
                    key={index}
                    onClick={() => selectDate(day!)}
                    disabled={!day || isPastDate(day)}
                    className={`
                      aspect-square flex items-center justify-center rounded-md text-sm
                      ${!day ? 'invisible' : ''}
                      ${isPastDate(day!) ? 'text-gray-400 cursor-not-allowed line-through opacity-50' : ''}
                      ${isToday(day!) ? 'bg-gray-100' : ''}
                      ${isSelected(day!) ? 'bg-orange-500 text-white' : !isPastDate(day!) ? 'hover:bg-orange-100' : ''}
                      ${!isSelected(day!) && !isToday(day!) && !isPastDate(day!) ? 'text-gray-700' : ''}
                    `}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Time to visit</label>
            <select
              value={formData.time}
              onChange={(e) => handleInputChange('time', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {timeSlots.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>

          {/* Number of people */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Number of people</label>
            <div className="grid grid-cols-2 gap-4">
              {/* Adults */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Adults</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleInputChange('partySize', Math.max(1, formData.partySize - 1))}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border border-gray-300 rounded-md min-w-[60px] text-center">
                    {formData.partySize}
                  </span>
                  <button
                    onClick={() => handleInputChange('partySize', Math.min(10, formData.partySize + 1))}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Children */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Children</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleInputChange('children', Math.max(0, (formData.children || 0) - 1))}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border border-gray-300 rounded-md min-w-[60px] text-center">
                    {formData.children || 0}
                  </span>
                  <button
                    onClick={() => handleInputChange('children', Math.min(8, (formData.children || 0) + 1))}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Special Occasion */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Occasion
            </label>
            <select
              value={formData.occasion || ''}
              onChange={(e) => handleInputChange('occasion', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">None</option>
              <option value="birthday">Birthday</option>
              <option value="anniversary">Anniversary</option>
              <option value="date">Date Night</option>
              <option value="business">Business Meeting</option>
              <option value="celebration">Celebration</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Right Column - Table Selection */}
        <div className="space-y-6 h-full">
          <div className="h-full flex flex-col">
            <label className="block text-sm text-gray-600 mb-2">Choose table</label>
            
            {/* Floor selector */}
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4].map(floor => (
                <button
                  key={floor}
                  onClick={() => setFloorNumber(floor)}
                  className={`px-4 py-2 rounded-md ${
                    floorNumber === floor 
                      ? 'bg-gray-200 text-gray-900' 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {floor === 1 ? '1st' : floor === 2 ? '2nd' : floor === 3 ? '3rd' : '4th'} floor
                </button>
              ))}
              <button className="px-4 py-2 rounded-md bg-gray-50 text-gray-600 hover:bg-gray-100">
                Rooftop
              </button>
            </div>

            {/* Floor Plan */}
            <div className="border border-gray-200 rounded-lg bg-gray-50 relative flex-1" style={{ minHeight: '800px' }}>
              <div className="p-4 h-full flex flex-col">
                <div className="relative w-full flex-1">
                  {tables[floorNumber]?.map((table) => (
                    <button
                      key={table.id}
                      onClick={() => handleTableClick(table)}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 transition-all ${
                        formData.tableId === table.id
                          ? 'bg-orange-500 border-orange-600 text-white'
                          : 'bg-white border-gray-300 hover:border-orange-400'
                      } ${table.large ? 'w-16 h-16' : 'w-12 h-12'}`}
                      style={{ 
                        left: `${table.x}%`, 
                        top: `${table.y}%`
                      }}
                    >
                      <div className="text-xs font-semibold">{table.seats}</div>
                    </button>
                  ))}
                  
                  {/* Table with checkmark (selected) */}
                  {formData.tableId && tables[floorNumber]?.find(t => t.id === formData.tableId) && (
                    <div
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ 
                        left: `${tables[floorNumber].find(t => t.id === formData.tableId)!.x}%`, 
                        top: `${tables[floorNumber].find(t => t.id === formData.tableId)!.y}%`
                      }}
                    >
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}

                  {/* Table Details Modal - Inside Floor Plan */}
                  {showTableModal && selectedTableDetails && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-black bg-opacity-50">
                      <div className="bg-white rounded-lg shadow-xl border border-gray-300 w-80 max-w-sm overflow-hidden">
                        <div className="flex flex-col">
                        {/* Top - Image */}
                        <div className="h-48 relative">
                          <img 
                            src={selectedTableDetails.image} 
                            alt={selectedTableDetails.name}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => setShowTableModal(false)}
                            className="absolute top-2 right-2 text-white hover:text-gray-300 p-1 bg-black bg-opacity-50 rounded-full"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Bottom - Details */}
                        <div className="p-4 flex flex-col">
                          <div className="mb-3">
                            <h3 className="text-lg font-bold">Table {selectedTableDetails.id}</h3>
                            <p className="text-sm text-gray-600">{selectedTableDetails.description}</p>
                          </div>
                          
                          <div className="flex items-center gap-3 text-xs text-gray-700 mb-3">
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <span>Seats {selectedTableDetails.seats}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span>Floor {floorNumber}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-4 flex-1">
                            {selectedTableDetails.features.slice(0, 2).map((feature, index) => (
                              <span
                                key={index}
                                className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>

                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => setShowTableModal(false)}
                              className="flex-1 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                              Back
                            </button>
                            <button
                              onClick={selectTable}
                              className="flex-1 py-2 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600"
                            >
                              Select
                            </button>
                          </div>
                        </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600">
                    {formData.tableId 
                      ? `Selected: ${tables[floorNumber]?.find(t => t.id === formData.tableId)?.name}`
                      : 'Click a table to view details'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t">
        <button onClick={handleCancel} className="text-gray-600 hover:text-gray-900">
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!formData.date || !formData.time || !formData.tableId || !formData.name || !formData.email || isLoading}
          className="px-8 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
        >
          {isLoading ? 'Processing...' : 'Continue'}
        </button>
      </div>

    </div>
  )
}