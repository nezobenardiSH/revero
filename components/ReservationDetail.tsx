'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

interface ReservationDetailProps {
  reservationId: string
  restaurantName: string
}

interface Reservation {
  id: number
  restaurantName: string
  tableNumber: number
  date: string
  time: string
  partySize: number
  guestName: string
  guestEmail: string
  status: string
  createdAt: string
}

export default function ReservationDetail({ reservationId, restaurantName }: ReservationDetailProps) {
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchReservation()
  }, [reservationId])

  const fetchReservation = async () => {
    try {
      const response = await fetch(`/api/reservations/${reservationId}`)
      if (!response.ok) {
        throw new Error('Reservation not found')
      }
      const data = await response.json()
      setReservation(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reservation')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = async () => {
    setIsCancelling(true)
    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to cancel reservation')
      }
      
      // Show success message and redirect
      alert('Reservation cancelled successfully')
      router.push(`/${restaurantName}`)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to cancel reservation')
    } finally {
      setIsCancelling(false)
      setShowCancelModal(false)
    }
  }

  const handleReschedule = () => {
    // Navigate to booking page with current reservation data
    router.push(`/book?reschedule=${reservationId}`)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number)
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reservation...</p>
        </div>
      </div>
    )
  }

  if (error || !reservation) {
    return (
      <div className="min-h-screen bg-white">
        <Header restaurantName={restaurantName} />

        <div className="max-w-md mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Reservation Not Found</h2>
            <p className="text-gray-600 mb-6">
              We couldn't find a reservation with code #{reservationId}
            </p>
            <button
              onClick={() => router.push(`/`)}
              className="px-6 py-3 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header restaurantName={restaurantName} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push(`/`)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>

        {/* Reservation Content */}
        <div>
          {/* Status Banner */}
          <div className={`px-6 py-3 mb-8 ${
            reservation.status === 'cancelled' 
              ? 'bg-red-500' 
              : 'bg-green-500'
          }`}>
            <p className="text-white font-medium text-center">
              {reservation.status === 'cancelled' ? 'Reservation Cancelled' : 'Reservation Confirmed'}
            </p>
          </div>

          {/* Reservation Info */}
          <div className="space-y-8">
            <div className="text-center pb-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Reservation #{reservation.id}
              </h2>
              <p className="text-gray-600">
                Booked for {reservation.guestName}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDate(reservation.date)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Time</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatTime(reservation.time)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Party Size</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {reservation.partySize} {reservation.partySize === 1 ? 'Guest' : 'Guests'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Table</p>
                  <p className="text-lg font-semibold text-gray-900">
                    Table {reservation.tableNumber}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {reservation.guestEmail}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Restaurant</p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">
                    {reservation.restaurantName}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {reservation.status !== 'cancelled' && (
              <div className="pt-6 border-t flex gap-4">
                <button
                  onClick={handleReschedule}
                  className="flex-1 py-3 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition-colors"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Reschedule
                  </div>
                </button>
                
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="flex-1 py-3 border-2 border-red-500 text-red-500 rounded-md font-medium hover:bg-red-50 transition-colors"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel Reservation
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="mt-8 p-4 border border-blue-200 rounded-md">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Important Information</p>
                <ul className="space-y-1">
                  <li>• Please arrive 5 minutes before your reservation time</li>
                  <li>• Table will be held for 15 minutes past reservation time</li>
                  <li>• Contact us at (123) 456-7890 for special requests</li>
                </ul>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Cancel Reservation?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this reservation? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={isCancelling}
                className="flex-1 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Keep Reservation
              </button>
              <button
                onClick={handleCancel}
                disabled={isCancelling}
                className="flex-1 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
              >
                {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}