import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const adminEmail = process.env.ADMIN_EMAIL || process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const rawPassword = process.env.ADMIN_PASSWORD || process.env.SEED_ADMIN_PASSWORD || 'password123';
  const adminName = process.env.ADMIN_NAME || 'Rifki Saifullah';

  const hashedPassword = await Bun.password.hash(rawPassword);

  const admin = await db.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword
    },
    create: {
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      avatarUrl: ''
    }
  });

  console.log('✅ Admin User seeded:', admin.email);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
