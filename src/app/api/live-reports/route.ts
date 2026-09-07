import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    const where = studentId ? { studentId } : {};

    const reports = await prisma.liveReport.findMany({
      where,
      include: {
        student: {
          select: { name: true, parentName: true, parentPhone: true, grade: true }
        }
      },
      orderBy: { date: 'desc' }
    });
    
    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error fetching live reports:', error);
    return NextResponse.json({ error: 'Failed to fetch live reports' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, topic, understanding, notes } = body;

    if (!studentId || !topic || !understanding) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const report = await prisma.liveReport.create({
      data: {
        studentId,
        topic,
        understanding,
        notes,
      },
      include: {
        student: true
      }
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Error creating live report:', error);
    return NextResponse.json({ error: 'Failed to create live report' }, { status: 500 });
  }
}
