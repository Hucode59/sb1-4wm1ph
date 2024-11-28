import React from 'react';
import { Bell, AlertTriangle, TrendingDown, CheckCircle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'warning' | 'alert' | 'success';
  title: string;
  message: string;
  date: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Dépassement de budget',
    message: 'Catégorie "Restauration" à 90% du budget mensuel',
    date: '2024-02-20'
  },
  {
    id: '2',
    type: 'alert',
    title: 'Abonnement inutilisé',
    message: 'Netflix non utilisé depuis 2 mois',
    date: '2024-02-19'
  },
  {
    id: '3',
    type: 'success',
    title: 'Objectif atteint',
    message: 'Épargne mensuelle dépassée de 15%',
    date: '2024-02-18'
  }
];

const notificationIcons = {
  warning: AlertTriangle,
  alert: TrendingDown,
  success: CheckCircle
};

const notificationColors = {
  warning: 'text-yellow-600 bg-yellow-50',
  alert: 'text-red-600 bg-red-50',
  success: 'text-green-600 bg-green-50'
};

export function NotificationsPanel() {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold">Notifications</h2>
        </div>
        <span className="text-sm text-gray-500">
          {mockNotifications.length} nouvelles
        </span>
      </div>

      <div className="divide-y">
        {mockNotifications.map((notification) => {
          const Icon = notificationIcons[notification.type];
          return (
            <div key={notification.id} className="p-4">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${notificationColors[notification.type]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}