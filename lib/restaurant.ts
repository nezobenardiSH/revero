import { prisma } from './db';

export async function getRestaurantBySubdomain(subdomain: string) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { 
        subdomain: subdomain.toLowerCase() 
      },
      include: {
        tables: {
          orderBy: { number: 'asc' }
        }
      }
    });
    
    return restaurant;
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return null;
  }
}