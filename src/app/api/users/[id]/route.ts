import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH - Update email/password user
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { email, password, name } = await request.json();
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) {
      // Cek email tidak dipakai user lain
      const existing = await prisma.user.findFirst({
        where: { email, NOT: { id: resolvedParams.id } }
      });
      if (existing) {
        return NextResponse.json({ error: 'Email sudah dipakai user lain' }, { status: 400 });
      }
      updateData.email = email;
    }
    if (password) {
      if (password.length < 4) {
        return NextResponse.json({ error: 'Password minimal 4 karakter' }, { status: 400 });
      }
      updateData.password = password;
    }
    const user = await prisma.user.update({
      where: { id: resolvedParams.id },
      data: updateData,
      select: { id: true, email: true, name: true, role: true }
    });
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal update user' }, { status: 500 });
  }
}

// DELETE - Hapus user
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await prisma.user.delete({ where: { id: resolvedParams.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal hapus user' }, { status: 500 });
  }
}
