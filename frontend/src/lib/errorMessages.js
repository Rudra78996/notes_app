/**
 * Error message mapping for user-friendly error messages
 */

// Firebase Auth error codes mapped to user-friendly messages
const authErrorMessages = {
  'auth/email-already-in-use': 'This email is already registered. Try signing in instead.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled. Please contact support.',
  'auth/weak-password': 'Password is too weak. Use at least 6 characters with a mix of letters and numbers.',
  'auth/user-disabled': 'This account has been disabled. Please contact support.',
  'auth/user-not-found': 'No account found with this email. Please sign up first.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/invalid-credential': 'Invalid email or password. Please check your credentials.',
  'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Please check your internet connection.',
  'auth/popup-closed-by-user': 'Sign-in was cancelled. Please try again.',
  'auth/requires-recent-login': 'Please sign in again to complete this action.',
};

// API error codes mapped to user-friendly messages
const apiErrorMessages = {
  'NETWORK_ERROR': 'Unable to connect to the server. Please check your internet connection.',
  'UNAUTHORIZED': 'Your session has expired. Please sign in again.',
  'FORBIDDEN': 'You don\'t have permission to perform this action.',
  'NOT_FOUND': 'The requested item was not found.',
  'SERVER_ERROR': 'Something went wrong on our end. Please try again later.',
  'TIMEOUT': 'The request timed out. Please try again.',
  'VALIDATION_ERROR': 'Please check your input and try again.',
};

// Note-specific error messages
const noteErrorMessages = {
  'LOAD_FAILED': 'Failed to load your notes. Please refresh the page.',
  'CREATE_FAILED': 'Failed to create note. Please try again.',
  'SAVE_FAILED': 'Failed to save your changes. Please try again.',
  'DELETE_FAILED': 'Failed to delete note. Please try again.',
  'SYNC_FAILED': 'Changes couldn\'t be synced. They\'ll be saved when you\'re back online.',
};

/**
 * Get a user-friendly error message from an error object or code
 * @param {Error|string|object} error - The error to parse
 * @param {string} context - The context where the error occurred (e.g., 'auth', 'notes')
 * @returns {object} An object with title and description
 */
export function getErrorMessage(error, context = 'general') {
  let errorCode = '';
  let originalMessage = '';

  // Extract error code and message
  if (typeof error === 'string') {
    errorCode = error;
    originalMessage = error;
  } else if (error?.code) {
    errorCode = error.code;
    originalMessage = error.message || '';
  } else if (error?.message) {
    originalMessage = error.message;
    // Try to extract code from Firebase error message
    const codeMatch = error.message.match(/\(([^)]+)\)/);
    if (codeMatch) {
      errorCode = codeMatch[1];
    }
  }

  // Check for auth errors
  if (authErrorMessages[errorCode]) {
    return {
      title: 'Authentication Error',
      description: authErrorMessages[errorCode],
    };
  }

  // Check for API errors
  if (apiErrorMessages[errorCode]) {
    return {
      title: 'Request Failed',
      description: apiErrorMessages[errorCode],
    };
  }

  // Check for note-specific errors
  if (noteErrorMessages[errorCode]) {
    return {
      title: 'Note Error',
      description: noteErrorMessages[errorCode],
    };
  }

  // Context-specific default messages
  const contextMessages = {
    auth: {
      title: 'Sign In Failed',
      description: originalMessage || 'Unable to sign in. Please check your credentials and try again.',
    },
    signup: {
      title: 'Sign Up Failed',
      description: originalMessage || 'Unable to create account. Please try again.',
    },
    notes: {
      title: 'Note Error',
      description: originalMessage || 'Something went wrong with your notes. Please try again.',
    },
    general: {
      title: 'Error',
      description: originalMessage || 'Something went wrong. Please try again.',
    },
  };

  return contextMessages[context] || contextMessages.general;
}

/**
 * Error types for different scenarios
 */
export const ErrorType = {
  AUTH: 'auth',
  SIGNUP: 'signup',
  NOTES: 'notes',
  GENERAL: 'general',
};
