import { createAuthClient } from 'better-auth/react';

export const {
  signIn,
  signOut,
  useSession,
  signUp,
  sendVerificationEmail,
  forgetPassword,
  resetPassword,
  updateUser,
  changeEmail,
  changePassword,
  deleteUser,
} = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.AUTH_URL,
});
