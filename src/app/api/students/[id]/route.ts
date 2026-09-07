import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const body = await request.json();
    const { nis, name, grade, school, phone, parentName, parentPhone, learningMode, status } = body;

    const student = await prisma.student.update({
      where: { id: params.id },
      data: {
        nis,
        name,
        grade,
        school,
        phone,
        parentName,
        parentPhone,
        learningMode,
        status,
      },
    });

    return NextResponse.json(student);
  } catch (error: any) {
    console.error("Error updating student:", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'NIS sudah terdaftar untuk siswa lain' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    await prisma.student.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}
