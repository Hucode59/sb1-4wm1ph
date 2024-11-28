export class AppError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleFirebaseError(error: unknown): AppError {
  console.error('Firebase error:', error);
  
  if (error instanceof Error) {
    return new AppError(error.message, 'FIREBASE_ERROR');
  }
  
  return new AppError('Une erreur inattendue est survenue', 'UNKNOWN_ERROR');
}