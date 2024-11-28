import { Message } from '../types/chat';

const systemPrompt = `Tu es FinAI, un coach financier expert. Tu aides les utilisateurs à:
- Analyser leurs dépenses et revenus
- Créer des budgets personnalisés
- Atteindre leurs objectifs financiers
- Comprendre les concepts financiers
- Prendre des décisions financières éclairées

Réponds de manière professionnelle, précise et bienveillante. Base tes conseils sur les meilleures pratiques financières.`;

export async function getChatGPTResponse(messages: Message[]): Promise<string> {
  try {
    const response = await fetch('https://us-central1-smartfinai.cloudfunctions.net/chatGPT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.content
          }))
        ]
      })
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la communication avec le service de chat');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Erreur du service de chat:', error);
    throw new Error('Désolé, je ne peux pas répondre pour le moment. Veuillez réessayer plus tard.');
  }
}