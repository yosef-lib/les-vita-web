const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lesvita.com' },
    update: {},
    create: {
      email: 'admin@lesvita.com',
      password: 'admin', // Normally hashed
      name: 'Master Admin',
      role: 'MASTER_ADMIN',
    },
  });

  // Create Tutor
  const tutor = await prisma.user.upsert({
    where: { email: 'nisa@lesvita.com' },
    update: {},
    create: {
      email: 'nisa@lesvita.com',
      password: 'nisa',
      name: 'Kak Nisa',
      role: 'TUTOR',
    },
  });

  console.log('Seeded Users:', { admin, tutor });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
