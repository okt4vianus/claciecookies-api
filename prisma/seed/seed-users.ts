import { hashPassword } from "~/lib/password";
import { prisma } from "~/lib/prisma";
import { dataUsers } from "~/modules/user/data";

export async function seedUsers() {
  for (const userData of dataUsers) {
    const { password, ...user } = userData;
    const upsertedUser = await prisma.user.upsert({
      where: { email: userData.email },
      update: { ...user },
      create: {
        ...user,
        password: { create: { hash: await hashPassword(password) } },
      },
    });
    console.info(`✓ User: ${upsertedUser.fullName} (${upsertedUser.email})`);
  }
}
