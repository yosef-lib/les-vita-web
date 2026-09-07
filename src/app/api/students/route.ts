import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nis, name, grade, school, phone, parentName, parentPhone, learningMode } = body;

    if (!nis || !name || !grade) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const student = await prisma.student.create({
      data: {
        nis,
        name,
        grade,
        school: school || "",
        phone: phone || "",
        parentName: parentName || "",
        parentPhone: parentPhone || "",
        learningMode: learningMode || "OFFLINE",
        status: "AKTIF",
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error: any) {
    console.error("Error creating student:", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'NIS sudah terdaftar' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
  }
}
