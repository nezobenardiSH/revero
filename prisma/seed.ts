import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create storeA restaurant
  const restaurant = await prisma.restaurant.create({
    data: {
      subdomain: 'storea',
      name: 'Store A Restaurant',
      email: 'hello@storea.com',
      maxCapacity: 30,
      tables: {
        create: [
          {
            number: 1,
            capacity: 2,
            photoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop'
          },
          {
            number: 2,
            capacity: 4,
            photoUrl: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop'
          },
          {
            number: 3,
            capacity: 4,
            photoUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop'
          },
          {
            number: 4,
            capacity: 6,
            photoUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop'
          },
          {
            number: 5,
            capacity: 6,
            photoUrl: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=400&h=300&fit=crop'
          }
        ]
      }
    }
  })

  console.log(`Created restaurant: ${restaurant.name} with subdomain: ${restaurant.subdomain}`)
  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })