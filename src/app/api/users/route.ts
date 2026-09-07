import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Ambil semua user (tanpa password)
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true }
    });
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data user' }, { status: 500 });
  }
}

// POST - Buat user baru
export async function POST(request: Request) {
  try {
    const { email, password, name, role } = await request.json();
    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 });
    }
    const user = await prisma.user.create({
      data: { email, password, name, role },
      select: { id: true, email: true, name: true, role: true, createdAt: true }
    });
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal membuat user' }, { status: 500 });
  }
}
