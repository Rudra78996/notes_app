const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export async function apiCall(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}

/**
 * Register user via backend
 */
export async function registerUser(email, password, name) {
  return apiCall('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
}

/**
 * Get user profile
 */
export async function getUserProfile(idToken) {
  return apiCall('/api/auth/profile', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
}

/**
 * Create a new note
 */
export async function createNote(idToken, title, content) {
  return apiCall('/api/notes', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ title, content }),
  });
}

/**
 * Get all notes for logged-in user
 */
export async function getNotes(idToken) {
  return apiCall('/api/notes', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
}

/**
 * Get a single note by ID
 */
export async function getNoteById(idToken, noteId) {
  return apiCall(`/api/notes/${noteId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
}

/**
 * Update a note
 */
export async function updateNote(idToken, noteId, title, content) {
  return apiCall(`/api/notes/${noteId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ title, content }),
  });
}

/**
 * Delete a note
 */
export async function deleteNote(idToken, noteId) {
  return apiCall(`/api/notes/${noteId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
}
