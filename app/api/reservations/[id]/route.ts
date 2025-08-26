import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  try {
    const reservation = await prisma.reservation.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        table: true,
        restaurant: true
      }
    })

    if (!reservation) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: reservation.id,
      restaurantName: reservation.restaurant.subdomain,
      tableNumber: reservation.table.number,
      date: reservation.date,
      time: reservation.time,
      partySize: reservation.partySize,
      guestName: reservation.guestName,
      guestEmail: reservation.guestEmail,
      status: reservation.status,
      createdAt: reservation.createdAt
    })
  } catch (error) {
    console.error('Error fetching reservation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  try {
    const reservation = await prisma.reservation.update({
      where: {
        id: parseInt(id)
      },
      data: {
        status: 'cancelled'
      }
    })

    return NextResponse.json({
      message: 'Reservation cancelled successfully',
      reservation
    })
  } catch (error) {
    console.error('Error cancelling reservation:', error)
    return NextResponse.json(
      { error: 'Failed to cancel reservation' },
      { status: 500 }
    )
  }
}