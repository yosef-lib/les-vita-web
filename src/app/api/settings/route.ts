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
          }),
          faqContent: JSON.stringify({
            faqs: [
              { q: "Ada program les apa saja?", a: "Kami punya program les SD & SMP:\n\n📚 SD: Calistung, Matematika & IPA, English Fun, Les Semua Mapel\n📚 SMP: Matematika & IPA, OSN, Ujian Sekolah, Bahasa Inggris\n\nMau tahu detail yang mana? 😊" },
              { q: "Berapa biaya les per bulan?", a: "Biaya mulai dari:\n\n• SD: Rp 250rb - 400rb/bulan\n• SMP: Rp 400rb - 500rb/bulan\n\nSudah termasuk modul & laporan WA ke orang tua!\n\n📲 Chat WA admin untuk info lebih detail ya!" },
              { q: "Bagaimana cara mendaftar?", a: "Cara daftar:\n1️⃣ Chat admin via WA\n2️⃣ Konsultasi gratis\n3️⃣ Pilih program & jadwal\n4️⃣ Mulai les! 🎉\n\n✅ Konsultasi & trial pertama GRATIS!" },
              { q: "Jadwal les hari apa?", a: "Jadwal fleksibel:\n⏰ Senin - Sabtu\n⏰ 13.00 - 20.00 WIB\n⏰ 60-90 menit/pertemuan\n\nBisa diatur sesuai kegiatan sekolah anak!" }
            ],
            fallback: "Mohon maaf, silakan hubungi lebih lanjut di WA admin kami: 08123456789"
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
        homepageContent: body.homepageContent ? JSON.stringify(body.homepageContent) : undefined,
        faqContent: body.faqContent ? JSON.stringify(body.faqContent) : undefined
      },
      create: {
        id: "global",
        chatbotPrompt: body.chatbotPrompt,
        homepageContent: body.homepageContent ? JSON.stringify(body.homepageContent) : undefined,
        faqContent: body.faqContent ? JSON.stringify(body.faqContent) : undefined
      }
    });

    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
