import { customSession, twoFactor } from 'better-auth/plugins';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { betterAuth } from 'better-auth';
import { db } from '@/db';
import { sendMail } from '../send-email';
import { findUserRoles } from '../find-user-roles';
import { canDeleteAccount } from '@/configs/settings/canDeleteAccount';

export const auth = betterAuth({
  appName: process.env.NEXT_PUBLIC_APP_NAME as string,
  database: prismaAdapter(db, {
    provider: 'mysql',
  }),
  user: {
    deleteUser: {
      enabled: canDeleteAccount,
      sendDeleteAccountVerification: async ({ user, url }) => {
        await sendMail({
          email: user.email,
          sendTo: user.email,
          subject: 'Verify Deletion',
          text: `Click <a href="${url}">here</a> to verify your deletion`,
          html: `<p>Click <a href="${url}">here</a> to verify your deletion</p>`,
        });
      },
    },
    changeEmail: {
      enabled: false,
      sendChangeEmailVerification: async ({ user, url }) => {
        await sendMail({
          email: user.email,
          sendTo: user.email,
          subject: 'Approve email change',
          text: `Click <a href="${url}">here</a> to approve your email change`,
          html: `<p>Click <a href="${url}">here</a> to approve your email change</p>`,
        });
      },
    },
  },
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
  plugins: [
    twoFactor(),
    customSession(async ({ user, session }) => {
      const roles = await findUserRoles(user);
      console.log(roles);
      return {
        user: {
          ...user,
          roles,
        },
        session,
      };
    }),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 2, // 2 day
    disableSessionRefresh: true,
  },
});
