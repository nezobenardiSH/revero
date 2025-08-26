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
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (tables.length === 0 && !isLoading) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-700">No tables available for your selected date and time.</p>
        <p className="text-sm text-yellow-600 mt-2">Please try a different time or date.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Table Selection */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Available Tables
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.map((table) => (
            <div
              key={table.id}
              onClick={() => handleTableSelect(table.id)}
              className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                selectedTableId === table.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                {table.photoUrl ? (
                  <img 
                    src={table.photoUrl} 
                    alt={`Table ${table.number}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    <div className="text-2xl mb-2">🪑</div>
                    <p className="text-sm">Table Photo</p>
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <h4 className="font-semibold text-gray-900">Table {table.number}</h4>
                <p className="text-sm text-gray-600">Seats up to {table.capacity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guest Information Form */}
      {showGuestForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Guest Information
          </h3>
          
          <form onSubmit={handleReservationSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={guestInfo.name}
                  onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setShowGuestForm(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back to Tables
              </button>
              
              <button
                type="submit"
                disabled={isLoading || !guestInfo.name || !guestInfo.email}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {isLoading ? 'Creating Reservation...' : 'Confirm Reservation'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}