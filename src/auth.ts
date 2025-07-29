import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, openAPI, username, phoneNumber } from "better-auth/plugins";

import { PrismaClient } from "~/generated/prisma";

const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://byclacie.com",
    "https://api.byclacie.com",
  ],

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectURI: "http://localhost:5173/auth/callback/google",
    },
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
      trustedProviders: ["credential", "email-password", "google", "facebook"],
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
    bearer(),
    openAPI(),
    username(),
    phoneNumber(),
    //...
  ],
});
