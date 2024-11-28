import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Target, PiggyBank, Search } from 'lucide-react';
import { getUserConversations } from '../../services/conversations';
import { useAuth } from '../../hooks/useAuth';
import { SavedConversation } from '../../types/chat';
import toast from 'react-hot-toast';

const categoryIcons = {
  budget: Brain,
  investment: TrendingUp,
  goals: Target,
  savings: PiggyBank
};

interface ConversationHistoryProps {
  selectedConversation: string | null;
  onSelectConversation: (id: string) => void;
}

export function ConversationHistory({
  selectedConversation,
  onSelectConversation
}: ConversationHistoryProps) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<SavedConversation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadConversations = async () => {
      if (!user) return;

      try {
        const userConversations = await getUserConversations(user.id);
        setConversations(userConversations);
      } catch (error) {
        toast.error('Erreur lors du chargement des conversations');
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();
  }, [user]);

  const filteredConversations = conversations.filter(
    conv => conv.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une conversation..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="divide-y">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">
            Chargement des conversations...
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? 'Aucune conversation trouvée' : 'Aucune conversation enregistrée'}
          </div>
        ) : (
          filteredConversations.map((conversation) => {
            const Icon = categoryIcons[conversation.category];
            return (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition ${
                  selectedConversation === conversation.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Icon className="w-5 h-5 text-blue-600 mt-1" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {conversation.title}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {conversation.lastMessage}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(conversation.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}