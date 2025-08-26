import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { restaurantId, tableId, date, time, partySize, guestName, guestEmail } = body;

    if (!restaurantId || !tableId || !date || !time || !partySize || !guestName || !guestEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const validationError = validateBookingTime(date, time);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const reservation = await createReservation(restaurantId, tableId, date, time, partySize, guestName, guestEmail);
    return NextResponse.json({ success: true, reservation });
  } catch (error) {
    console.error('Reservation error:', error);
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
  }
}

function validateBookingTime(date: string, time: string): string | null {
  const bookingDateTime = new Date(`${date}T${time}:00.000Z`);
  const now = new Date();
  const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  if (bookingDateTime < twentyFourHoursFromNow) {
    return 'Reservations must be made at least 24 hours in advance';
  }

  return null;
}

async function createReservation(restaurantId: number, tableId: number, date: string, time: string, partySize: number, guestName: string, guestEmail: string) {
  const existingReservation = await prisma.reservation.findUnique({
    where: {
      tableId_date_time: {
        tableId,
        date,
        time
      }
    }
  });

  if (existingReservation) {
    throw new Error('Table is already booked for this time');
  }

  const reservation = await prisma.reservation.create({
    data: {
      restaurantId,
      tableId,
      date,
      time,
      partySize,
      guestName,
      guestEmail
    }
  });

  return reservation;
}