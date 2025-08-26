'use client'

import { use } from 'react'
import ReservationDetail from '../../../../components/ReservationDetail'

export default function ReservationDetailPage({ 
  params 
}: { 
  params: Promise<{ subdomain: string; id: string }> 
}) {
  const resolvedParams = use(params)

  return (
    <ReservationDetail 
      reservationId={resolvedParams.id} 
      restaurantName={resolvedParams.subdomain} 
    />
  )
}