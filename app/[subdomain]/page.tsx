'use client'

import { useState, useEffect, use } from 'react'
import BookingForm from '../../components/BookingForm'
import TableSelector from '../../components/TableSelector'

interface Table {
  id: number
  number: number
  capacity: number
  photoUrl: string | null
}

interface BookingFormData {
  date: string
  time: string
  partySize: number
}

interface GuestInfo {
  name: string
  email: string
}

interface ReservationConfirmation {
  id: number
  restaurantName: string
  tableName: string
  date: string
  time: string
  partySize: number
  guestName: string
}

export default function RestaurantPage({ 
  params 
}: { 
  params: Promise<{ subdomain: string }> 
}) {
  const resolvedParams = use(params)
  const [restaurant, setRestaurant] = useState<any>(null)
  const [availableTables, setAvailableTables] = useState<Table[]>([])
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false)
  const [isCreatingReservation, setIsCreatingReservation] = useState(false)
  const [availabilityError, setAvailabilityError] = useState<string>('')
  const [confirmation, setConfirmation] = useState<ReservationConfirmation | null>(null)
  const [currentBookingData, setCurrentBookingData] = useState<BookingFormData | null>(null)

  useEffect(() => {
    // Load restaurant info - for now just use subdomain
    setRestaurant({ name: resolvedParams.subdomain, id: 1 })
  }, [resolvedParams.subdomain])

  const handleAvailabilityCheck = async (bookingData: BookingFormData) => {
    setIsLoadingAvailability(true)
    setAvailabilityError('')
    setCurrentBookingData(bookingData)
    
    try {
      const response = await fetch(
        `/api/availability?date=${bookingData.date}&time=${bookingData.time}&partySize=${bookingData.partySize}&restaurantId=1`
      )
      
      if (!response.ok) {
        throw new Error('Failed to check availability')
      }
      
      const tables: Table[] = await response.json()
      setAvailableTables(tables)
    } catch (error) {
      setAvailabilityError('Unable to check availability. Please try again.')
      setAvailableTables([])
    } finally {
      setIsLoadingAvailability(false)
    }
  }

  const handleReservationCreate = async (tableId: number, guestInfo: GuestInfo) => {
    if (!currentBookingData) return
    
    setIsCreatingReservation(true)
    
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurantId: 1,
          tableId,
          date: currentBookingData.date,
          time: currentBookingData.time,
          partySize: currentBookingData.partySize,
          guestName: guestInfo.name,
          guestEmail: guestInfo.email,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create reservation')
      }

      const result = await response.json()
      const selectedTable = availableTables.find(t => t.id === tableId)
      
      setConfirmation({
        id: result.id,
        restaurantName: restaurant.name,
        tableName: `Table ${selectedTable?.number}`,
        date: currentBookingData.date,
        time: currentBookingData.time,
        partySize: currentBookingData.partySize,
        guestName: guestInfo.name,
      })
    } catch (error) {
      setAvailabilityError(error instanceof Error ? error.message : 'Failed to create reservation')
    } finally {
      setIsCreatingReservation(false)
    }
  }

  if (confirmation) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Reservation Confirmed!</h1>
              <p className="text-gray-600 mt-2">Your table has been successfully booked.</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h2 className="font-semibold text-gray-900 mb-3">Reservation Details</h2>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Confirmation ID:</span> #{confirmation.id}</p>
                <p><span className="font-medium">Restaurant:</span> {confirmation.restaurantName}</p>
                <p><span className="font-medium">Table:</span> {confirmation.tableName}</p>
                <p><span className="font-medium">Date:</span> {new Date(confirmation.date).toLocaleDateString()}</p>
                <p><span className="font-medium">Time:</span> {confirmation.time}</p>
                <p><span className="font-medium">Party Size:</span> {confirmation.partySize} guests</p>
                <p><span className="font-medium">Guest Name:</span> {confirmation.guestName}</p>
              </div>
            </div>
            
            <button
              onClick={() => {
                setConfirmation(null)
                setAvailableTables([])
                setCurrentBookingData(null)
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Make Another Reservation
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
          Welcome to {restaurant?.name || resolvedParams.subdomain}
        </h1>
        
        <BookingForm 
          onAvailabilityCheck={handleAvailabilityCheck}
          isLoading={isLoadingAvailability}
        />
        
        {(availableTables.length > 0 || availabilityError) && (
          <TableSelector 
            tables={availableTables}
            onReservationCreate={handleReservationCreate}
            isLoading={isCreatingReservation}
            error={availabilityError}
          />
        )}
      </div>
    </div>
  )
}