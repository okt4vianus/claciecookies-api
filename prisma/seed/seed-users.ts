import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { dataSeedUsers } from "@/modules/user/data";

export async function seedUsers() {
  console.info("\n 🟢 Seeding users... \n");

  for (const dataSeedUser of dataSeedUsers) {
    const { password, ...userItem } = dataSeedUser;

    const existingUser = await prisma.user.findUnique({
      where: { email: userItem.email },
    });

    if (existingUser) {
      console.info(
        `ℹ️ User exists: ${existingUser.email} ${existingUser.name} @${existingUser.username}`
      );
      continue;
    }

    try {
      const { user } = await auth.api.signUpEmail({
        body: {
          name: userItem.name,
          email: userItem.email,
          username: userItem.username,
          password,
        },
      });

      console.info(`👤 User: ${user.email} ${user.name}`);
    } catch (error) {
      console.error("⚠️ Error signing up user:", error);
      break;
    }

    // Replace by better-auth
    // const upsertedUser = await prisma.user.upsert({
    //   where: { email: userData.email },
    //   update: { ...user },
    //   create: {
    //     ...user,
    //     password: { create: { hash: await hashPassword(password) } },
    //   },
    // });
    // console.info(`✓ User: ${upsertedUser.fullName} (${upsertedUser.email})`);
  }
}
