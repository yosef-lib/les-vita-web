export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function askVitaAI(
  messages: ChatMessage[],
  systemPrompt?: string,
  model: string = 'clario/deepseek-v4-flash'
): Promise<string> {
  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages,
        systemPrompt,
        model
      })
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Gagal menghubungi Kak Vita AI');
    }

    const data = await res.json();
    return data.content;
  } catch (error: any) {
    console.error('Error in askVitaAI client:', error);
    throw error;
  }
}
