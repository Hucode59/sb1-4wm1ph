export interface FirestoreConversation {
  title: string;
  category: string;
  messages: Array<{
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: FirebaseTimestamp;
  }>;
  lastMessage: string;
  date: FirebaseTimestamp;
  userId: string;
}

interface FirebaseTimestamp {
  seconds: number;
  nanoseconds: number;
}