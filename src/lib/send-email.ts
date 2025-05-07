'use server';

import nodemailer from 'nodemailer';

const EMAIL_SERVER_HOST = process.env.EMAIL_SERVER_HOST;
const EMAIL_SERVER_USER = process.env.EMAIL_SERVER_USER;
const EMAIL_SERVER_PASSWORD = process.env.EMAIL_SERVER_PASSWORD;
const EMAIL_SERVER_PORT = process.env.EMAIL_SERVER_PORT;
const EMAIL_FROM = process.env.EMAIL_FROM;

const transporter = nodemailer.createTransport({
  host: EMAIL_SERVER_HOST,
  port: Number(EMAIL_SERVER_PORT),
  secure: true, // true for 465, false for other ports
  auth: {
    user: EMAIL_SERVER_USER,
    pass: EMAIL_SERVER_PASSWORD,
  },
});

export async function sendMail({
  email,
  sendTo,
  subject,
  text,
  html,
}: {
  email: string;
  sendTo?: string;
  subject: string;
  text: string;
  html?: string;
}) {
  try {
    const isVerified = await transporter.verify();
    if (!isVerified) {
      throw new Error('SMTP verification failed');
    }

    const info = await transporter.sendMail({
      from: `${email} <${EMAIL_FROM}>`,
      to: sendTo || EMAIL_FROM,
      subject: subject,
      text: text,
      html: html || '',
    });

    console.log('Message Sent', info.messageId);
    console.log('Mail sent to', sendTo || EMAIL_FROM);
    return info;
  } catch (error) {
    console.error(
      'Email Error:',
      error instanceof Error ? error.message : 'Unknown error',
      '\nSMTP Settings:',
      EMAIL_SERVER_HOST,
      EMAIL_SERVER_USER
    );
    throw new Error('Failed to send email');
  }
}
