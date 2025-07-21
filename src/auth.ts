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
  // https://www.better-auth.com/docs/reference/options#verification
  user: {
    modelName: "User",
  },
  account: {
    modelName: "Account",
    accountLinking: {
      enabled: true,
      trustedProviders: ["email-password", "google", "facebook"],
      allowDifferentEmails: true,
      allowUnlinkingAll: true,
    },
    updateAccountOnSignIn: true,
  },
  session: {
    modelName: "Session",
  },
  verification: {
    modelName: "Verification",
  },

  plugins: [
    openAPI(),
    // username(),
    // phoneNumber({
    //   sendOTP: ({ phoneNumber, code }, request) => {
    //   },
    // }),
  ],
});
