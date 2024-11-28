import { collection, addDoc, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Message, SavedConversation, ConversationCategory } from '../types/chat';
import { FirestoreConversation } from '../types/firebase';
import { AppError, handleFirebaseError } from '../utils/errorHandling';

function validateConversationData(messages: Message[], userId: string): void {
  if (!messages.length) {
    throw new AppError('Aucun message à sauvegarder', 'VALIDATION_ERROR');
  }
  if (!userId || userId.trim() === '') {
    throw new AppError('Utilisateur non identifié', 'AUTH_ERROR');
  }
}

function generateConversationTitle(messages: Message[]): string {
  const firstUserMessage = messages.find(m => m.sender === 'user');
  if (!firstUserMessage) return 'Nouvelle conversation';
  
  const maxLength = 50;
  const title = firstUserMessage.content;
  return title.length > maxLength
    ? `${title.substring(0, maxLength)}...`
    : title;
}

export async function saveConversation(
  messages: Message[],
  userId: string,
  category: ConversationCategory
): Promise<string> {
  try {
    validateConversationData(messages, userId);

    const title = generateConversationTitle(messages);
    const conversation: FirestoreConversation = {
      title,
      category,
      messages: messages.map(msg => ({
        ...msg,
        timestamp: Timestamp.fromDate(new Date(msg.timestamp))
      })),
      lastMessage: messages[messages.length - 1].content,
      date: Timestamp.now(),
      userId
    };

    const docRef = await addDoc(collection(db, 'conversations'), conversation);
    return docRef.id;
  } catch (error) {
    throw handleFirebaseError(error);
  }
}

export async function getUserConversations(userId: string): Promise<SavedConversation[]> {
  try {
    if (!userId) {
      throw new AppError('ID utilisateur requis', 'AUTH_ERROR');
    }

    const q = query(
      collection(db, 'conversations'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as FirestoreConversation;
      return {
        id: doc.id,
        title: data.title,
        category: data.category as ConversationCategory,
        messages: data.messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp.toDate()
        })),
        lastMessage: data.lastMessage,
        date: data.date.toDate().toISOString(),
        userId: data.userId
      };
    });
  } catch (error) {
    throw handleFirebaseError(error);
  }
}