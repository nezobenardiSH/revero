'use client'

import { useState, useEffect, use } from 'react'
import LandingPage from '../../components/LandingPage'

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

  return <LandingPage restaurantName={resolvedParams.subdomain} />
}