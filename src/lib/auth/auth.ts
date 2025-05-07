import { twoFactor } from 'better-auth/plugins';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { betterAuth } from 'better-auth';
import { db } from '@/db';
import { sendMail } from '../send-email';

export const auth = betterAuth({
  appName: process.env.NEXT_PUBLIC_APP_NAME as string,
  database: prismaAdapter(db, {
    provider: 'mysql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    maxPasswordLength: 64,
    autoSignIn: true,
    sendResetPassword: async ({ user, url }) => {
      await sendMail({
        email: user.email,
        sendTo: user.email,
        subject: 'Reset your password',
        text: `Click <a href="${url}">here</a> to reset your password`,
        html: `<p>Click <a href="${url}">here</a> to reset your password</p>`,
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendMail({
        email: user.email,
        sendTo: user.email,
        subject: 'Verify your email',
        text: `Click <a href="${url}">here</a> to verify your email`,
        html: `<p>Click <a href="${url}">here</a> to verify your email</p>`,
      });
    },
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [twoFactor()],
});
