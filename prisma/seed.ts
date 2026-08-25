import { PrismaClient, FurnitureCategory } from '@prisma/client';

const prisma = new PrismaClient();

// Sample furniture, only for local testing. Feel free to add/remove items.
const furnitureItems = [
  {
    name: 'Wooden Chair',
    description: 'Comfortable wooden chair',
    price: 120,
    dimensions: '40x40x90',
    quantity: 5,
    category: FurnitureCategory.CHAIR,
  },
  {
    name: 'Dining Table',
    description: 'Large dining table, seats 6',
    price: 500,
    dimensions: '180x90x75',
    quantity: 3,
    category: FurnitureCategory.TABLE,
  },
  {
    name: 'Leather Sofa',
    description: 'Three-seat leather sofa',
    price: 950,
    dimensions: '220x90x85',
    quantity: 2,
    category: FurnitureCategory.SOFA,
  },
  {
    name: 'Queen Bed Frame',
    description: 'Solid wood queen-size bed frame',
    price: 700,
    dimensions: '160x200x40',
    quantity: 4,
    category: FurnitureCategory.BED,
  },
  {
    name: 'Storage Cabinet',
    description: 'Two-door storage cabinet',
    price: 300,
    dimensions: '80x40x120',
    quantity: 1,
    category: FurnitureCategory.CABINET,
  },
];

async function main() {
  // Wipe existing furniture only (not users/orders) so re-running this
  // script always leaves a known, predictable set of items to test with.
  await prisma.furniture.deleteMany();

  await prisma.furniture.createMany({
    data: furnitureItems,
  });

  console.log(`Seeded ${furnitureItems.length} furniture items.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
