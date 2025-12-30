import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { createNote, getNotes, updateNote, deleteNote } from '../services/api';

function NotesDashboard() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '' });

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError('');
      const idToken = await user.getIdToken();
      const response = await getNotes(idToken);
      
      if (response.success) {
        setNotes(response.notes || []);
      } else {
        // Log error for debugging, but show user-friendly message
        console.error('Failed to load notes:', response.message);
        setError('Failed to load notes. Please try again later.');
      }
    } catch (err) {
      // Log error for debugging, but show user-friendly message
      console.error('Error fetching notes:', err);
      setError('Unable to connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const idToken = await user.getIdToken();
      const response = await createNote(idToken, formData.title, formData.content);
      
      if (response.success) {
        setNotes([response.note, ...notes]);
        setFormData({ title: '', content: '' });
        setShowCreateModal(false);
      } else {
        console.error('Failed to create note:', response.message);
        setError('Failed to create note. Please try again.');
      }
    } catch (err) {
      console.error('Error creating note:', err);
      setError('Unable to save note. Please try again later.');
    }
  };

  const handleUpdateNote = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const idToken = await user.getIdToken();
      const response = await updateNote(idToken, editingNote.id, formData.title, formData.content);
      
      if (response.success) {
        setNotes(notes.map(note => 
          note.id === editingNote.id 
            ? { ...note, title: formData.title, content: formData.content }
            : note
        ));
        setFormData({ title: '', content: '' });
        setEditingNote(null);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
      setError('');
      const idToken = await user.getIdToken();
      const response = await deleteNote(idToken, noteId);
      
      if (response.success) {
        setNotes(notes.filter(note => note.id !== noteId));
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const openEditModal = (note) => {
    setEditingNote(note);
    setFormData({ title: note.title, content: note.content });
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingNote(null);
    setFormData({ title: '', content: '' });
    setError('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold text-gray-600">Loading notes...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Your Notes</h2>
          <p className="text-gray-600 mt-1">{notes.length} {notes.length === 1 ? 'note' : 'notes'} total</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-0.5"
        >
          + Create Note
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6 border-l-4 border-red-700">
          {error}
        </div>
      )}

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No notes yet</h3>
          <p className="text-gray-500 mb-6">Create your first note to get started</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
          >
            Create Your First Note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border-t-4 border-blue-500"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                {note.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {note.content}
              </p>
              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <span className="text-xs text-gray-500">
                  {new Date(note.created_at.seconds ? note.created_at.seconds * 1000 : note.created_at).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(note)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || editingNote) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {editingNote ? 'Edit Note' : 'Create New Note'}
            </h3>
            
            <form onSubmit={editingNote ? handleUpdateNote : handleCreateNote} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-gray-700 font-semibold text-sm mb-2">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Enter note title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm"
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-gray-700 font-semibold text-sm mb-2">
                  Content
                </label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  placeholder="Write your note content here..."
                  rows="8"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 text-sm resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  {editingNote ? 'Update Note' : 'Create Note'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotesDashboard;
