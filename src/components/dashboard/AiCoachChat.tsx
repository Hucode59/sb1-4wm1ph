import React, { useState, useRef, useEffect } from 'react';
import { Brain, X, Send, Maximize2, Minimize2, Loader, HelpCircle } from 'lucide-react';
import { Message, ConversationCategory } from '../../types/chat';
import { getMistralResponse } from '../../services/mistral';
import { saveConversation } from '../../services/conversations';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const SUGGESTED_QUESTIONS = [
  "Comment puis-je économiser davantage ce mois-ci ?",
  "Quel est mon budget restant pour ce mois ?",
  "Peux-tu analyser mes dépenses récentes ?",
  "Comment atteindre plus rapidement mes objectifs d'épargne ?",
  "Simule une réduction de 20% de mes dépenses en restauration"
];

interface SaveConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: ConversationCategory) => Promise<void>;
}

function SaveConversationModal({ isOpen, onClose, onSave }: SaveConversationModalProps) {
  const [category, setCategory] = useState<ConversationCategory>('budget');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(category);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde de la conversation');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">Sauvegarder la conversation</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catégorie
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ConversationCategory)}
            className="w-full p-2 border rounded-lg"
            disabled={isSaving}
          >
            <option value="budget">Budget</option>
            <option value="investment">Investissement</option>
            <option value="goals">Objectifs</option>
            <option value="savings">Épargne</option>
          </select>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            disabled={isSaving}
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            {isSaving ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Sauvegarde...</span>
              </>
            ) : (
              <span>Sauvegarder</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AiCoachChat() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Bonjour${user?.displayName ? ` ${user.displayName}` : ''} ! Je suis votre coach financier FinAI. Je peux vous aider à :
- Analyser vos dépenses et revenus
- Créer des budgets personnalisés
- Atteindre vos objectifs financiers
- Simuler des scénarios financiers
- Recevoir des conseils proactifs

Comment puis-je vous aider aujourd'hui ?`,
      sender: 'ai',
      timestamp: new Date()
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSuggestedQuestion = (question: string) => {
    setMessage(question);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      const aiResponse = await getMistralResponse([...messages, userMessage], user || undefined);
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      }]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      toast.error(errorMessage);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: "Désolé, je rencontre des difficultés techniques. Veuillez réessayer plus tard.",
        sender: 'ai',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (messages.length > 1) {
      setShowSaveModal(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleSaveConversation = async (category: ConversationCategory) => {
    if (!user?.id) {
      toast.error('Vous devez être connecté pour sauvegarder une conversation');
      return;
    }

    try {
      await saveConversation(messages, user.id, category);
      toast.success('Conversation sauvegardée avec succès');
      setShowSaveModal(false);
      setIsOpen(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde de la conversation');
    }
  };

  useEffect(() => {
    const handleOpenAiCoach = () => setIsOpen(true);
    window.addEventListener('openAiCoach', handleOpenAiCoach);
    return () => window.removeEventListener('openAiCoach', handleOpenAiCoach);
  }, []);

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2 group z-50"
        >
          <Brain className="w-6 h-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-200 ease-in-out">
            Coach FinAI
          </span>
        </button>
      )}

      {isOpen && (
        <div
          className={`fixed right-6 bottom-6 bg-white rounded-lg shadow-xl transition-all duration-200 ease-in-out z-50 ${
            isExpanded ? 'w-[600px] h-[80vh]' : 'w-[380px] h-[500px]'
          }`}
        >
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6" />
              <span className="font-semibold">Coach FinAI</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="p-1 hover:bg-blue-700 rounded"
                title="Voir les suggestions"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:bg-blue-700 rounded"
              >
                {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-blue-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-4 overflow-y-auto space-y-4" style={{ height: 'calc(100% - 130px)' }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            {showSuggestions && !isLoading && messages.length === 1 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Questions suggérées :</p>
                {SUGGESTED_QUESTIONS.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="block w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Posez votre question..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                className={`p-2 rounded-lg transition ${
                  isLoading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <SaveConversationModal
        isOpen={showSaveModal}
        onClose={() => {
          setShowSaveModal(false);
          setIsOpen(false);
        }}
        onSave={handleSaveConversation}
      />
    </>
  );
}