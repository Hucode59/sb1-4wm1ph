import React from 'react';
import { LineChart, Shield, Brain, PiggyBank, TrendingUp, Users } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: "IA Avancée",
    description: "Analyses personnalisées basées sur vos habitudes financières"
  },
  {
    icon: LineChart,
    title: "Suivi en Temps Réel",
    description: "Visualisez vos dépenses et investissements en temps réel"
  },
  {
    icon: Shield,
    title: "Sécurité Maximale",
    description: "Protection de vos données avec un chiffrement de niveau bancaire"
  },
  {
    icon: PiggyBank,
    title: "Objectifs d'Épargne",
    description: "Définissez et suivez vos objectifs d'épargne intelligemment"
  },
  {
    icon: TrendingUp,
    title: "Conseils d'Investissement",
    description: "Recommandations personnalisées pour optimiser vos investissements"
  },
  {
    icon: Users,
    title: "Support Premium",
    description: "Assistance personnalisée 24/7 par nos experts financiers"
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Fonctionnalités Intelligentes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez comment SmartFinAI révolutionne la gestion de vos finances personnelles
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}