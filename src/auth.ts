import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI } from "better-auth/plugins";
import { username } from "better-auth/plugins";
import { phoneNumber } from "better-auth/plugins";

import { PrismaClient } from "./generated/prisma";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    // TODO: Enable later
    // google: {
    //   clientId: process.env.GOOGLE_CLIENT_ID as string,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    // },
    // facebook: {
    //   clientId: process.env.FACEBOOK_CLIENT_ID as string,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    // },
  },

  // rename: User, Session, Account, Verification

  plugins: [
    openAPI(),

    // username(),
    // phoneNumber({
    //   sendOTP: ({ phoneNumber, code }, request) => {
    //   },
    // }),
  ],
});
