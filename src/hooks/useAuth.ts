import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendEmailVerification,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { AuthState, UserProfile } from '../types/auth';
import { AppError } from '../utils/errorHandling';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
      if (user) {
        const userProfile: UserProfile = {
          id: user.uid,
          email: user.email || '',
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setAuthState({ user: userProfile, loading: false, error: null });
      } else {
        setAuthState({ user: null, loading: false, error: null });
      }
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string): Promise<FirebaseUser> => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(result.user);
      return result.user;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de l\'inscription';
      throw new AppError(message, 'AUTH_ERROR');
    }
  };

  const signIn = async (email: string, password: string): Promise<FirebaseUser> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de la connexion';
      throw new AppError(message, 'AUTH_ERROR');
    }
  };

  const signInWithGoogle = async (): Promise<FirebaseUser> => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de la connexion avec Google';
      throw new AppError(message, 'AUTH_ERROR');
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
      setAuthState({ user: null, loading: false, error: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de la déconnexion';
      throw new AppError(message, 'AUTH_ERROR');
    }
  };

  const getCurrentUser = (): UserProfile | null => {
    return authState.user;
  };

  return {
    ...authState,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    getCurrentUser,
  };
}