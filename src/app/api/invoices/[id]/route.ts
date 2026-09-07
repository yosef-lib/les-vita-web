import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: { student: true }
    });
    
    if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json({ error: 'Failed to fetch invoice' }, { status: 500 });
  }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const body = await request.json();
    const { status, paymentDate } = body;

    const invoice = await prisma.invoice.update({
      where: { id: params.id },
      data: {
        status,
        paymentDate: paymentDate ? new Date(paymentDate) : undefined,
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
  }
}
