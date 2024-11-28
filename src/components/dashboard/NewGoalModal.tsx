import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const goalSchema = z.object({
  name: z.string().min(1, 'Le nom de l\'objectif est requis'),
  targetAmount: z.number().min(1, 'Le montant doit être supérieur à 0'),
  deadline: z.string().min(1, 'La date limite est requise'),
  priority: z.enum(['low', 'medium', 'high']),
  category: z.enum(['savings', 'debt']),
});

type GoalFormData = z.infer<typeof goalSchema>;

interface NewGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GoalFormData) => void;
}

export function NewGoalModal({ isOpen, onClose, onSubmit }: NewGoalModalProps) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      priority: 'medium',
      category: 'savings',
    },
  });

  const targetAmount = watch('targetAmount');
  const deadline = watch('deadline');

  const calculateMonthlyAmount = () => {
    if (!targetAmount || !deadline) return null;
    
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const monthsDiff = (deadlineDate.getFullYear() - today.getFullYear()) * 12 + 
                      (deadlineDate.getMonth() - today.getMonth());
    
    if (monthsDiff <= 0) return null;
    return (targetAmount / monthsDiff).toFixed(2);
  };

  const monthlyAmount = calculateMonthlyAmount();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Nouvel objectif financier</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l'objectif
            </label>
            <input
              type="text"
              {...register('name')}
              className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Voyage au Japon"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Montant cible (€)
            </label>
            <input
              type="number"
              {...register('targetAmount', { valueAsNumber: true })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="5000"
            />
            {errors.targetAmount && (
              <p className="mt-1 text-sm text-red-600">{errors.targetAmount.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date limite
            </label>
            <input
              type="date"
              {...register('deadline')}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.deadline && (
              <p className="mt-1 text-sm text-red-600">{errors.deadline.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priorité
            </label>
            <select
              {...register('priority')}
              className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="low">Faible</option>
              <option value="medium">Moyenne</option>
              <option value="high">Élevée</option>
            </select>
            {errors.priority && (
              <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <select
              {...register('category')}
              className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="savings">Épargne</option>
              <option value="debt">Remboursement</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          {monthlyAmount && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Pour atteindre votre objectif, vous devrez épargner environ{' '}
                <span className="font-semibold">{monthlyAmount}€</span> par mois.
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Créer l'objectif
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}