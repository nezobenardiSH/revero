import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const time = searchParams.get('time');
  const partySize = parseInt(searchParams.get('partySize') || '0');
  const restaurantId = parseInt(searchParams.get('restaurantId') || '0');

  if (!date || !time || !partySize || !restaurantId) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    const availableTables = await checkAvailability(restaurantId, date, time, partySize);
    return NextResponse.json(availableTables);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function checkAvailability(restaurantId: number, date: string, time: string, partySize: number) {
  const bookedTables = await prisma.reservation.findMany({
    where: {
      restaurantId,
      date: date,
      time: time
    },
    select: { tableId: true }
  });

  const bookedTableIds = bookedTables.map(r => r.tableId);

  const availableTables = await prisma.table.findMany({
    where: {
      restaurantId,
      capacity: { gte: partySize },
      id: { notIn: bookedTableIds }
    },
    orderBy: { capacity: 'asc' }
  });

  return availableTables;
}