import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: "global" }
    });
    
    // Create default if not exists
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: "global",
          chatbotPrompt: `Anda adalah "Kak Vita", tutor AI yang sangat ramah, sabar, ceria, dan pandai mengajar anak SD, SMP, dan SMA/SNBT. 
Tujuan Anda adalah membantu siswa belajar dan menjawab soal-soal sekolah dengan penjelasan langkah-demi-langkah yang mudah dipahami.
Gunakan bahasa Indonesia yang santun, hangat, menyemangati, dan gunakan emotikon yang bersahabat.
Jika ada rumus matematika atau fisika, jelaskan dengan rapi dan berikan trik cepatnya jika ada.`,
          homepageContent: JSON.stringify({
            programs: {
              sd: [
                { icon: "📚", title: "Les Semua Mapel SD", desc: "Pendampingan lengkap semua mata pelajaran SD (Kelas 1–6), mulai dari Matematika, IPA, IPS, Bahasa Indonesia hingga Bahasa Inggris. Termasuk persiapan ujian semester dan asesmen nasional.", price: "Hubungi Kami" }
              ],
              smp: [
                { icon: "📖", title: "Les Semua Mapel SMP", desc: "Bimbingan lengkap semua mata pelajaran SMP (Kelas 7–9), mencakup Matematika, IPA, IPS, Bahasa Indonesia, Bahasa Inggris. Termasuk persiapan ujian sekolah dan masuk SMA favorit.", price: "Hubungi Kami" }
              ]
            }
          })
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const settings = await prisma.siteSettings.upsert({
      where: { id: "global" },
      update: {
        chatbotPrompt: body.chatbotPrompt !== undefined ? body.chatbotPrompt : undefined,
        homepageContent: body.homepageContent ? JSON.stringify(body.homepageContent) : undefined
      },
      create: {
        id: "global",
        chatbotPrompt: body.chatbotPrompt,
        homepageContent: body.homepageContent ? JSON.stringify(body.homepageContent) : undefined
      }
    });

    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
