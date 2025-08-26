'use client'

import { useState } from 'react'

interface Table {
  id: number
  number: number
  capacity: number
  photoUrl: string | null
}

interface GuestInfo {
  name: string
  email: string
}

interface TableSelectorProps {
  tables: Table[]
  onReservationCreate: (tableId: number, guestInfo: GuestInfo) => void
  isLoading: boolean
  error?: string
}

export default function TableSelector({ tables, onReservationCreate, isLoading, error }: TableSelectorProps) {
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null)
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({ name: '', email: '' })
  const [showGuestForm, setShowGuestForm] = useState(false)

  const handleTableSelect = (tableId: number) => {
    setSelectedTableId(tableId)
    setShowGuestForm(true)
  }

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedTableId && guestInfo.name && guestInfo.email) {
      onReservationCreate(selectedTableId, guestInfo)
    }
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-2xl p-4">
        <p className="text-red-600 text-center">{error}</p>
      </div>
    )
  }

  if (tables.length === 0 && !isLoading) {
    return (
      <div className="max-w-md mx-auto bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
        <p className="text-yellow-700">No tables available for your selected date and time.</p>
        <p className="text-sm text-yellow-600 mt-2">Please try a different time or date.</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Table Selection */}
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Select a Table
        </h3>
        
        <div className="space-y-3">
          {tables.map((table) => (
            <div
              key={table.id}
              onClick={() => handleTableSelect(table.id)}
              className={`cursor-pointer rounded-2xl border-2 p-4 transition-all ${
                selectedTableId === table.id 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">Table {table.number}</h4>
                  <p className="text-sm text-gray-600">Seats up to {table.capacity} guests</p>
                </div>
                <div className="text-purple-600">
                  {selectedTableId === table.id && (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guest Information Form */}
      {showGuestForm && (
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Guest Information
          </h3>
          
          <form onSubmit={handleReservationSubmit} className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={guestInfo.name}
                  onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={guestInfo.email}
                  onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowGuestForm(false)}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              
              <button
                type="submit"
                disabled={isLoading || !guestInfo.name || !guestInfo.email}
                className="flex-1 py-3 px-4 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:bg-gray-400 transition-colors font-medium"
              >
                {isLoading ? 'Creating...' : 'Confirm'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}