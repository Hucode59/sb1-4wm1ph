import axios from 'axios';
import { Message } from '../types/chat';
import { UserProfile } from '../types/auth';
import { getDashboardDataForAI } from './dashboardData';

const MISTRAL_API_KEY = 'QOvAEmfWsJwoVq5VaP80l481hARCqAjC';
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

const createSystemPrompt = (userProfile?: UserProfile) => {
  const dashboardData = getDashboardDataForAI();
  
  let prompt = `Tu es FinAI, un coach financier expert francophone spécialisé dans:
- L'analyse personnalisée des dépenses et revenus
- La création de budgets sur mesure
- L'accompagnement vers les objectifs financiers
- L'éducation financière et la prise de décision éclairée
- La simulation de scénarios financiers
- Le suivi proactif des habitudes financières

Instructions spécifiques:
1. Réponds toujours en français de manière professionnelle et bienveillante
2. Base tes conseils sur les meilleures pratiques financières
3. Propose des suggestions concrètes et actionnables
4. Aide à la prise de décision avec des analyses chiffrées
5. Encourage les bonnes habitudes financières
6. Sois proactif dans tes recommandations
7. Utilise les données du tableau de bord pour des réponses précises

${dashboardData}`;

  if (userProfile) {
    prompt += `\n\nInformations utilisateur:
- Revenu mensuel: ${userProfile.monthlyIncome || 'Non spécifié'}€
- Objectifs financiers: ${userProfile.financialGoals?.join(', ') || 'Non spécifiés'}`;
  }

  return prompt;
};

interface MistralMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface MistralResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function getMistralResponse(messages: Message[], userProfile?: UserProfile): Promise<string> {
  try {
    const formattedMessages: MistralMessage[] = [
      { role: 'system', content: createSystemPrompt(userProfile) },
      ...messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
    ];

    const response = await axios.post<MistralResponse>(
      MISTRAL_API_URL,
      {
        model: 'mistral-tiny',
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 0.95,
        presence_penalty: 0.5,
        frequency_penalty: 0.5
      },
      {
        headers: {
          'Authorization': `Bearer ${MISTRAL_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error('Réponse invalide du service Mistral');
    }

    return response.data.choices[0].message.content;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error?.message || error.message;
      console.error('Erreur Mistral API:', errorMessage);
      throw new Error(`Erreur de communication avec le service Mistral: ${errorMessage}`);
    }
    console.error('Erreur inattendue:', error);
    throw new Error('Une erreur inattendue est survenue');
  }
}