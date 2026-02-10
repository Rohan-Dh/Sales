import { DataSource } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { Role } from './entities/role.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  extra:
    process.env.DB_SSL === 'true' ? { ssl: { rejectUnauthorized: false } } : {},
  synchronize: true,
  logging: false,
  entities: [Permission, Role],
});

async function resetDatabase(ds: DataSource) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Refusing to drop schema in production.');
  }

  console.log('Dropping all tables...');
  await ds.dropDatabase();

  console.log('Recreating schema...');
  await ds.synchronize();
}

export async function runSeed(dataSource: DataSource) {
  const permissionRepo = dataSource.getRepository(Permission);
  const roleRepo = dataSource.getRepository(Role);

  const permissionCodes = [
    'CREATE_SINGLE_ENTRY',
    'CREATE_MULTIPLE_ENTRY',
    'VIEW_LEADERBOARD',
  ] as const;

  const permissions = await permissionRepo.save(
    permissionCodes.map((code) => permissionRepo.create({ code })),
  );

  const agentPermissions = permissions.filter(
    (p) => p.code === 'CREATE_SINGLE_ENTRY',
  );

  const adminRole = roleRepo.create({
    name: 'ADMIN',
    permissions,
  });

  const agentRole = roleRepo.create({
    name: 'AGENT',
    permissions: agentPermissions,
  });

  await roleRepo.save([adminRole, agentRole]);

  console.log('Database seeded successfully');
}

async function bootstrap() {
  try {
    console.log('Starting DEV reset + seed...');

    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is missing in environment variables');
    }

    await AppDataSource.initialize();
    console.log('Database connected');

    await resetDatabase(AppDataSource);
    await runSeed(AppDataSource);

    await AppDataSource.destroy();
    console.log('Reset + seeding finished');
    process.exit(0);
  } catch (error) {
    console.error('Reset + seed failed', error);
    process.exit(1);
  }
}

bootstrap();
