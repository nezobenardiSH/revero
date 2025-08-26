'use client'

import { useState, useEffect, use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import BookingFormNew from '../../../components/BookingFormNew'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'

interface ReservationConfirmation {
  id: number
  restaurantName: string
  tableName: string
  date: string
  time: string
  partySize: number
  guestName: string
}

export default function BookPage({ 
  params 
}: { 
  params: Promise<{ subdomain: string }> 
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [restaurant, setRestaurant] = useState<any>(null)
  const [isCreatingReservation, setIsCreatingReservation] = useState(false)
  const [confirmation, setConfirmation] = useState<ReservationConfirmation | null>(null)
  const rescheduleId = searchParams.get('reschedule')

  useEffect(() => {
    setRestaurant({ name: resolvedParams.subdomain, id: 1 })
  }, [resolvedParams.subdomain])

  const handleReservationSubmit = async (bookingData: any) => {
    setIsCreatingReservation(true)
    
    try {
      const timeParts = bookingData.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
      let hour = parseInt(timeParts[1])
      const minute = timeParts[2]
      const period = timeParts[3].toUpperCase()
      
      if (period === 'PM' && hour !== 12) {
        hour += 12
      } else if (period === 'AM' && hour === 12) {
        hour = 0
      }
      
      const formattedTime = `${hour.toString().padStart(2, '0')}:${minute}`

      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurantId: 1,
          tableId: bookingData.tableId,
          date: bookingData.date,
          time: formattedTime,
          partySize: bookingData.partySize,
          guestName: bookingData.name,
          guestEmail: bookingData.email,
          rescheduleId: rescheduleId
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create reservation')
      }

      const result = await response.json()
      
      setConfirmation({
        id: result.reservation.id,
        restaurantName: restaurant.name,
        tableName: `Table ${bookingData.tableId}`,
        date: bookingData.date,
        time: bookingData.time,
        partySize: bookingData.partySize,
        guestName: bookingData.name,
      })
    } catch (error) {
      console.error('Reservation error:', error)
      alert(error instanceof Error ? error.message : 'Failed to create reservation')
    } finally {
      setIsCreatingReservation(false)
    }
  }

  if (confirmation) {
    return (
      <div className="min-h-screen bg-white">
        <Header restaurantName={resolvedParams.subdomain} />

        <div className="max-w-md mx-auto px-4 py-8">
          <div className="text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {rescheduleId ? 'Reservation Rescheduled!' : 'Reservation Confirmed!'}
              </h1>
              <p className="text-gray-600 mt-2">Your table has been successfully booked.</p>
            </div>
            
            <div className="border border-orange-200 rounded-md p-5 mb-6">
              <h2 className="font-semibold text-gray-900 mb-4">Reservation Details</h2>
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Confirmation ID</span>
                  <span className="font-medium">#{confirmation.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Restaurant</span>
                  <span className="font-medium capitalize">{confirmation.restaurantName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Table</span>
                  <span className="font-medium">{confirmation.tableName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">{new Date(confirmation.date + 'T00:00:00').toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time</span>
                  <span className="font-medium">{confirmation.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Guests</span>
                  <span className="font-medium">{confirmation.partySize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Name</span>
                  <span className="font-medium">{confirmation.guestName}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => router.push(`/${resolvedParams.subdomain}/reservation/${confirmation.id}`)}
                className="w-full py-3 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition-colors"
              >
                View Reservation
              </button>
              <button
                onClick={() => router.push(`/${resolvedParams.subdomain}`)}
                className="w-full py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header restaurantName={resolvedParams.subdomain} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <BookingFormNew 
          onReservationSubmit={handleReservationSubmit}
          isLoading={isCreatingReservation}
        />
        <Footer />
      </div>
    </div>
  )
}