import { PrismaClient, Role } from '@prisma/client';
import { generatePassword } from './utils';

const prisma = new PrismaClient();

/**
 * Create a superadmin user if none exists
 */
export async function seedSuperAdmin() {
  const superAdminEmail = process.env.SUPERADMIN_EMAIL || 'admin@coficab.com';
  const firstName = process.env.SUPERADMIN_FIRST_NAME || 'bnadereddine';
  const lastName = process.env.SUPERADMIN_LAST_NAME || 'ouertani';
  const username = process.env.SUPERADMIN_USERNAME || 'bader.ouertani';
  const phoneRaw = process.env.SUPERADMIN_PHONE; // empty string => null

  // Always ensure one canonical SUPERADMIN with provided email
  let existingByEmail = await prisma.user.findUnique({ where: { email: superAdminEmail } });

  const password = process.env.SUPERADMIN_PASSWORD || generatePassword();
  // Store password as plain text (as requested)

  if (existingByEmail) {
    // If role not SUPERADMIN or profile fields differ, update them
    const needsUpdate = (
      existingByEmail.role !== Role.SUPERADMIN ||
      existingByEmail.firstName !== firstName ||
      existingByEmail.lastName !== lastName ||
      existingByEmail.username !== username ||
      (phoneRaw ? existingByEmail.phone !== phoneRaw : false)
    );
    if (needsUpdate) {
      existingByEmail = await prisma.user.update({
        where: { id: existingByEmail.id },
        data: {
          firstName,
            lastName,
          username,
          role: Role.SUPERADMIN,
          phone: phoneRaw === '' ? null : phoneRaw,
        },
      });
      console.log('Updated existing SUPERADMIN profile to match env configuration');
    } else {
      console.log('SUPERADMIN already matches desired configuration');
    }

    // If we intentionally want to enforce the env password, update if mismatch
    if (password !== existingByEmail.password) {
      await prisma.user.update({ where: { id: existingByEmail.id }, data: { password: password } });
      console.log('SUPERADMIN password synced from environment');
    }
    return existingByEmail;
  }

  // No user with that email -> create fresh SUPERADMIN
  const superAdmin = await prisma.user.create({
    data: {
      email: superAdminEmail,
      firstName,
      lastName,
      username,
      password: password,
      role: Role.SUPERADMIN,
      phone: phoneRaw === '' ? null : phoneRaw,
      ligneIds: [],
    },
  });

  console.log(`SuperAdmin created with email: ${superAdminEmail}`);
  console.log(`Initial password: ${password}`);
  return superAdmin;
}
