import React from 'react';
import { Check } from 'lucide-react';

const plans = [
  {
    name: "Débutant",
    price: "0€",
    period: "pour toujours",
    features: [
      "Analyse basique des dépenses",
      "Suivi de budget mensuel",
      "Alertes de dépenses",
      "Support par email"
    ],
    highlighted: false
  },
  {
    name: "Pro",
    price: "9.99€",
    period: "par mois",
    features: [
      "Toutes les fonctionnalités Débutant",
      "Conseils d'investissement IA",
      "Prévisions financières avancées",
      "Support prioritaire 24/7",
      "Analyses personnalisées",
      "Export de données"
    ],
    highlighted: true
  },
  {
    name: "Entreprise",
    price: "Sur mesure",
    period: "contactez-nous",
    features: [
      "Toutes les fonctionnalités Pro",
      "API dédiée",
      "Gestionnaire de compte dédié",
      "Formation personnalisée",
      "Sécurité renforcée"
    ],
    highlighted: false
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Tarifs Transparents
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choisissez le plan qui correspond le mieux à vos besoins
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-sm p-8 ${
                plan.highlighted ? 'ring-2 ring-blue-600 shadow-lg' : ''
              }`}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-600">/{plan.period}</span>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 px-6 rounded-full font-semibold transition ${
                  plan.highlighted
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Commencer
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}