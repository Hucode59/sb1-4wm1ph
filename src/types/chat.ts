export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface SavedConversation {
  id: string;
  title: string;
  category: ConversationCategory;
  messages: Message[];
  lastMessage: string;
  date: string;
  userId: string;
}

export type ConversationCategory = 'budget' | 'investment' | 'goals' | 'savings';