import React, { useState } from 'react';
import { ConversationHistory } from '../components/finai/ConversationHistory';
import { ChatInterface } from '../components/finai/ChatInterface';
import { SimulationPanel } from '../components/finai/SimulationPanel';
import { NotificationsPanel } from '../components/finai/NotificationsPanel';
import { PerformanceReport } from '../components/finai/PerformanceReport';

export function FinAIPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Mon FinAI</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Historique des conversations */}
          <div className="col-span-3">
            <ConversationHistory
              selectedConversation={selectedConversation}
              onSelectConversation={setSelectedConversation}
            />
          </div>

          {/* Interface principale */}
          <div className="col-span-6">
            <div className="space-y-6">
              <ChatInterface selectedConversation={selectedConversation} />
              <SimulationPanel />
            </div>
          </div>

          {/* Panneau latéral droit */}
          <div className="col-span-3 space-y-6">
            <NotificationsPanel />
            <PerformanceReport />
          </div>
        </div>
      </main>
    </div>
  );
}