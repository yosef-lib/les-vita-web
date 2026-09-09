import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { messages, model, systemPrompt } = await req.json();

    const baseUrl = process.env.AI_BASE_URL || 'http://api-direct.apicloud.my.id:8088/v1';
    const apiKey = process.env.AI_API_KEY || 'sk-clario-281f6b893aa17a2ed85ed564756b918ab8467e1926e43eae';
    const selectedModel = model || process.env.AI_DEFAULT_MODEL || 'clario/deepseek-v4-flash';

    const settings = await prisma.siteSettings.findUnique({ where: { id: "global" } });
    
    const defaultSystem = systemPrompt || settings?.chatbotPrompt || `Anda adalah "Kak Vita", tutor AI yang sangat ramah, sabar, ceria, dan pandai mengajar anak SD, SMP, dan SMA/SNBT. 
Tujuan Anda adalah membantu siswa belajar dan menjawab soal-soal sekolah dengan penjelasan langkah-demi-langkah yang mudah dipahami.
Gunakan bahasa Indonesia yang santun, hangat, menyemangati, dan gunakan emotikon yang bersahabat.
Jika ada rumus matematika atau fisika, jelaskan dengan rapi dan berikan trik cepatnya jika ada.`;

    const fullMessages = [
      { role: 'system', content: defaultSystem },
      ...(messages || [])
    ];

    // Timeout 60 detik untuk mengakomodasi trafik saat server API padat
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: fullMessages,
        temperature: 0.7
      }),
      signal: AbortSignal.timeout(60000)
    });

    if (!response.ok) {
      const errBody = await response.text();
      return NextResponse.json({ error: `Clario API Error: ${errBody}` }, { status: response.status });
    }

    const data = await response.json();
    const replyContent = data.choices?.[0]?.message?.content || 'Maaf Kak Vita sedang memproses, silakan coba lagi sebentar ya!';

    return NextResponse.json({ content: replyContent, usage: data.usage });
  } catch (error: any) {
    console.error('Error in /api/ai/chat:', error);
    return NextResponse.json({ error: error.message || 'Server API sedang padat, silakan coba kirim ulang.' }, { status: 500 });
  }
}
