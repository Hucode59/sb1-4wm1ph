import React from 'react';
import { Brain, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Déconnexion réussie');
      navigate('/');
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="w-8 h-8" />
          <span className="text-xl font-bold">SmartFinAI</span>
        </div>
        <div className="hidden md:flex space-x-8">
          <a href="#features" className="hover:text-blue-200 transition">Fonctionnalités</a>
          <a href="#how-it-works" className="hover:text-blue-200 transition">Comment ça marche</a>
          <a href="#pricing" className="hover:text-blue-200 transition">Tarifs</a>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-white hover:text-blue-200 transition text-sm font-semibold"
              >
                Tableau de bord
              </Link>
              <button
                onClick={handleSignOut}
                className="bg-white text-blue-600 px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-50 transition"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white hover:text-blue-200 transition text-sm font-semibold"
              >
                Connexion
              </Link>
              <Link
                to="/signup"
                className="bg-white text-blue-600 px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-50 transition"
              >
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </nav>

      <div className="container mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Votre Coach Financier Personnel Alimenté par l'IA
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            Optimisez vos finances et atteignez vos objectifs financiers avec l'aide de notre IA avancée.
          </p>
          <div className="flex space-x-4">
            {user ? (
              <Link
                to="/dashboard"
                className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition flex items-center"
              >
                Tableau de bord <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
            ) : (
              <Link
                to="/signup"
                className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition flex items-center"
              >
                Essai Gratuit <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
            )}
            <button className="border-2 border-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition">
              En savoir plus
            </button>
          </div>
        </div>
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80"
            alt="Analytics Dashboard"
            className="rounded-lg shadow-2xl"
          />
        </div>
      </div>
    </header>
  );
}