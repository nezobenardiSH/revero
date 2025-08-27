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
      
      // setConfirmation({
      //   id: result.reservation.id,
      //   restaurantName: restaurant.name,
      //   tableName: `Table ${bookingData.tableId}`,
      //   date: bookingData.date,
      //   time: bookingData.time,
      //   partySize: bookingData.partySize,
      //   guestName: bookingData.name,
      // })

      router.push(`/reservation/${result.reservation.id}`)

      setIsCreatingReservation(false)

    } catch (error) {
      console.error('Reservation error:', error)
      alert(error instanceof Error ? error.message : 'Failed to create reservation')
    } finally {
      // setIsCreatingReservation(false) // Removed from here
    }
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