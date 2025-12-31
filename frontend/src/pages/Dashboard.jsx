import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createNote, getNotes, updateNote, deleteNote } from '../services/api';
import { Button } from '../components/ui/button';
import RichTextEditor from '../components/RichTextEditor';
import { NoteSidebar } from '../components/NoteSidebar';
import { SidebarProvider, SidebarTrigger } from '../components/ui/sidebar';
import { ChevronRight, Sun, Moon, Download } from 'lucide-react';
import { ErrorAlert } from '../components/ui/error-alert';

import { createContext, useContext } from 'react';
export const ThemeContext = createContext({ isDarkMode: false });

function Dashboard() {
  const navigate = useNavigate();
  const { user, logOut } = useAuth();
  const [notes, setNotes] = useState([]);

  const handleLogout = async () => {
    await logOut();
    navigate('/');
  };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createTitle, setCreateTitle] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleExportNote = () => {
    if (!selectedNote) return;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = editContent;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    const exportContent = `# ${editTitle}\n\n${plainText}`;
    const blob = new Blob([exportContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${editTitle || 'untitled'}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
        const notesList = response.notes || [];
        setNotes(notesList);
        if (notesList.length > 0) {
          selectNote(notesList[0]);
        }
      } else {
        console.error('Failed to load notes:', response.message);
        setError('Failed to load notes. Please try again later.');
      }
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Unable to connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const selectNote = (note) => {
    setSelectedNote(note);
    setEditTitle(note.title);
    setEditContent(note.content || '');
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
      setAutoSaveTimer(null);
    }
    setSaveStatus('saved');
  };

  const handleCreateNote = async () => {
    try {
      setError('');
      const idToken = await user.getIdToken();
      const response = await createNote(idToken, createTitle, createDescription);
      
      if (response.success) {
        const newNote = response.note;
        setNotes([newNote, ...notes]);
        selectNote(newNote);
        setShowCreateModal(false);
        setCreateTitle('');
        setCreateDescription('');
      } else {
        console.error('Failed to create note:', response.message);
        setError('Failed to create note. Please try again.');
      }
    } catch (err) {
      console.error('Error creating note:', err);
      setError('Unable to save note. Please try again later.');
    }
  };

  // Auto-save functionality
  useEffect(() => {
    if (selectedNote && (editTitle !== selectedNote.title || editContent !== selectedNote.content)) {
      setSaveStatus('unsaved');
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
      const timer = setTimeout(() => {
        autoSaveNote();
      }, 1000);
      setAutoSaveTimer(timer);
    }
    // Clean up timer on unmount or note change
    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [editTitle, editContent, selectedNote]);

  const autoSaveNote = useCallback(async () => {
    if (!selectedNote) return;

    try {
      setIsSaving(true);
      const idToken = await user.getIdToken();
      const response = await updateNote(idToken, selectedNote.id, editTitle, editContent);
      
      if (response.success) {
        // Update the note in the list
        setNotes(notes.map(note => 
          note.id === selectedNote.id 
            ? { ...note, title: editTitle, content: editContent }
            : note
        ));
        
        setSelectedNote(prev => ({
          ...prev,
          title: editTitle,
          content: editContent
        }));
        
        setSaveStatus('saved');
      } else {
        console.error('Failed to save note:', response.message);
        setError('Failed to save note.');
      }
    } catch (err) {
      console.error('Error saving note:', err);
      setError('Unable to save note. Please try again later.');
    } finally {
      setIsSaving(false);
    }
  }, [selectedNote, editTitle, editContent, user, notes]);

  const handleDeleteNote = async (noteId) => {
    if (!noteId) return;
    try {
      setError('');
      const idToken = await user.getIdToken();
      const response = await deleteNote(idToken, noteId);
      if (response.success) {
        const updatedNotes = notes.filter(note => note.id !== noteId);
        setNotes(updatedNotes);
        setSelectedNote(null);
        setIsEditing(false);
        if (updatedNotes.length > 0) {
          selectNote(updatedNotes[0]);
        }
      } else {
        console.error('Failed to delete note:', response.message);
        setError('Failed to delete note. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting note:', err);
      setError('Unable to delete note. Please try again later.');
    }
  };


  useEffect(() => {
    if (selectedNote) {
      setEditTitle(selectedNote.title);
      setEditContent(selectedNote.content || '');
    }
  }, [selectedNote]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="text-xl font-semibold text-muted-foreground">Loading notes...</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background w-full">
        {/* Sidebar */}
        <NoteSidebar
          notes={notes}
          selectedNote={selectedNote}
          onSelectNote={selectNote}
          onCreateNote={() => setShowCreateModal(true)}
          onDeleteNote={handleDeleteNote}
          isDarkMode={isDarkMode}
        />
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-background min-h-0 min-w-0">
          
          {/* Top Navigation Bar with Breadcrumb and Logout */}
          <div className="bg-background border-b border-border px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <SidebarTrigger className="mr-2" />
              <span className="text-foreground font-medium">Notes</span>
              {selectedNote && (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-foreground font-medium">{selectedNote.title || 'Untitled'}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              {selectedNote && (
                <button
                  onClick={handleExportNote}
                  className="p-2 rounded-lg border border-border hover:bg-accent transition-colors"
                  title="Export note"
                >
                  <Download className="w-5 h-5 text-foreground" />
                </button>
              )}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg border border-border hover:bg-accent transition-colors"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground" />}
              </button>
              <Button
                onClick={handleLogout}
                variant="outline"
              >
                Logout
              </Button>
            </div>
          </div>

          {/* Main Editor Area */}
          {selectedNote ? (
            <div className="flex-1 flex flex-col overflow-hidden min-h-0 min-w-0">
              {/* Error Message */}
              {error && (
                <div className="px-8 py-3">
                  <ErrorAlert
                    error={error}
                    context="notes"
                    onDismiss={() => setError('')}
                  />
                </div>
              )}

              {/* Editor Content - Using RichTextEditor */}
              <div className="flex-1 overflow-hidden p-6 flex flex-col min-h-0">
                <RichTextEditor
                  content={editContent}
                  noteId={selectedNote?.id}
                  onUpdate={(newContent) => {
                    setEditContent(newContent);
                  }}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-background">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-4">
                <img
                  src="/writing.png"
                  alt="Notes logo"
                  className="w-12 h-12 object-contain dark:invert"
                />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">No note selected</h3>
              <p className="text-muted-foreground mb-6">Create or select a note to get started</p>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3"
              >
                Create Your First Note
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Create Note Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg p-8 max-w-md w-full border border-border shadow-lg">
            <h3 className="text-2xl font-bold text-foreground mb-6">Create New Note</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="create-title" className="block text-foreground font-semibold text-sm mb-2">
                  Title
                </label>
                <input
                  id="create-title"
                  type="text"
                  value={createTitle}
                  onChange={(e) => setCreateTitle(e.target.value)}
                  placeholder="Enter note title..."
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                />
              </div>

              <div>
                <label htmlFor="create-description" className="block text-foreground font-semibold text-sm mb-2">
                  Description
                </label>
                <textarea
                  id="create-description"
                  value={createDescription}
                  onChange={(e) => setCreateDescription(e.target.value)}
                  placeholder="Enter note description..."
                  rows="4"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleCreateNote}
                  disabled={!createTitle.trim()}
                  className="flex-1"
                >
                  Create Note
                </Button>
                <Button
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreateTitle('');
                    setCreateDescription('');
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SidebarProvider>
  );
}

export default Dashboard;
