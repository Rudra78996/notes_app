import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';
import { ChevronRight, Plus, Trash2 } from 'lucide-react';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from './ui/dialog';

export function NoteSidebar({ notes, selectedNote, onSelectNote, onCreateNote, onDeleteNote, isDarkMode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteAlert, setDeleteAlert] = useState({ open: false, note: null });
  const navigate = useNavigate();
  const { user, logOut } = useAuth();

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const email = user?.email || '';
  const initial = displayName.charAt(0).toUpperCase();

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedNotes = filteredNotes.sort((a, b) => {
    const dateA = new Date(a.created_at.seconds ? a.created_at.seconds * 1000 : a.created_at);
    const dateB = new Date(b.created_at.seconds ? b.created_at.seconds * 1000 : b.created_at);
    return dateB - dateA;
  });

  const handleDeleteClick = (note) => {
    setDeleteAlert({ open: true, note });
  };

  const confirmDelete = () => {
    if (deleteAlert.note) {
      onDeleteNote(deleteAlert.note.id);
    }
    setDeleteAlert({ open: false, note: null });
  };

  const cancelDelete = () => {
    setDeleteAlert({ open: false, note: null });
  };

  return (
    <Sidebar>
      <div className="flex flex-col h-full">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 mt-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-8 h-8 rounded-lg flex items-center justify-center mr-2"
            >
              <img
                src="/writing.png"
                alt="Notes logo"
                className="w-12 h-12 object-contain dark:invert"
              />
            </button>
            <h2 className="text-lg font-bold text-sidebar-foreground">Notes</h2>
          </div>

          {/* Create Note Button */}
          <Button
            onClick={onCreateNote}
            className="w-full font-semibold py-2 mt-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Note
          </Button>

          {/* Search Bar */}
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mt-3"
          />
        </SidebarHeader>

        <SidebarContent className="flex-1 min-h-0">
          <SidebarGroup>
            <SidebarGroupLabel>All Notes</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {sortedNotes.length === 0 ? (
                  <div className="px-2 py-4 text-center text-muted-foreground text-sm">
                    {searchQuery ? 'No notes found' : 'No notes yet'}
                  </div>
                ) : (
                  sortedNotes.map((note) => (
                    <SidebarMenuItem key={note.id} className="group">
                      <div
                        onClick={() => onSelectNote(note)}
                        className={`flex items-center justify-between group cursor-pointer px-2 py-2 rounded-md transition-colors ${
                          selectedNote?.id === note.id
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                        }`}
                      >
                        <div className="flex-1 flex flex-col gap-1 min-w-0">
                          <span className="font-semibold truncate text-sm">
                            {note.title || 'Untitled'}
                          </span>
                          <span
                            className={`text-xs truncate ${
                              selectedNote?.id === note.id
                                ? 'text-sidebar-accent-foreground/70'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {note.content
                              ?.replace(/<[^>]*>/g, '')
                              .substring(0, 50) || 'No content'}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(note);
                          }}
                          className={`opacity-0 group-hover:opacity-100 p-1 transition-opacity flex-shrink-0 ml-2 ${
                            selectedNote?.id === note.id
                              ? 'text-red-400 hover:text-red-500'
                              : 'text-muted-foreground hover:text-red-500'
                          }`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </SidebarMenuItem>
                  ))
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <div className="mt-auto px-3 py-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
              {initial}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-sidebar-foreground truncate">{displayName}</div>
              <div className="text-xs text-muted-foreground truncate">{email}</div>
            </div>
          </div>
        </div>

        <SidebarRail />

        {/* Delete Dialog */}
        <Dialog open={deleteAlert.open} onOpenChange={(open) => !open && cancelDelete()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Note</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete <b>"{deleteAlert.note?.title || 'Untitled'}"</b>? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
              <DialogClose asChild>
                <Button variant="outline" onClick={cancelDelete}>
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Sidebar>
  );
}
