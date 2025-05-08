import { db } from '@/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const testimonials = await db.testimonial.findMany();
  return NextResponse.json(testimonials);
}
