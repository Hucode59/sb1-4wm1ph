import React from 'react';
import { Building2 } from 'lucide-react';
import { useBanks } from '../../hooks/useBanks';
import { Bank } from '../../types/banking';

interface BankListProps {
  searchTerm: string;
  onSelect: (bank: Bank) => void;
}

export function BankList({ searchTerm, onSelect }: BankListProps) {
  const { banks, isLoading } = useBanks();

  const filteredBanks = banks.filter(bank =>
    bank.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2 text-gray-600">Chargement des banques...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
      {filteredBanks.map((bank) => (
        <button
          key={bank.id}
          onClick={() => onSelect(bank)}
          className="flex items-center space-x-3 p-4 rounded-lg border hover:border-blue-500 hover:bg-blue-50 transition"
        >
          {bank.logoUrl ? (
            <img
              src={bank.logoUrl}
              alt={bank.name}
              className="w-10 h-10 object-contain"
            />
          ) : (
            <Building2 className="w-10 h-10 text-blue-600" />
          )}
          <div className="text-left">
            <h3 className="font-medium">{bank.name}</h3>
            <p className="text-sm text-gray-500">{bank.connectionMethod}</p>
          </div>
        </button>
      ))}
    </div>
  );
}