import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const homeworks = await prisma.homework.findMany({
      include: {
        student: {
          select: { name: true, grade: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(homeworks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch homeworks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, title, description, dueDate } = body;
    
    const homework = await prisma.homework.create({
      data: {
        studentId,
        title,
        description,
        dueDate: new Date(dueDate),
        status: 'BELUM'
      }
    });
    
    return NextResponse.json(homework);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create homework' }, { status: 500 });
  }
}
