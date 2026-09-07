import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, message } = body;

    if (!phone || !message) {
      return NextResponse.json({ error: 'Phone and message are required' }, { status: 400 });
    }

    // Fonnte API Mockup / Integration
    // In a real application, you would replace this with the actual Fonnte API call
    /*
    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        "Authorization": process.env.FONNTE_TOKEN || "",
      },
      body: new URLSearchParams({
        target: phone,
        message: message,
      }),
    });
    const result = await response.json();
    */

    console.log(`[WA API MOCK] Sending message to ${phone}:`);
    console.log(message);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({ success: true, message: 'Message sent successfully (Mock)' });
  } catch (error) {
    console.error('Error sending WA message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
