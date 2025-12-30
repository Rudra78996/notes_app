import { Injectable, UnauthorizedException } from '@nestjs/common';
import { firebaseDb } from '../config/firebase.config';

@Injectable()
export class NotesService {
  /**
   * Create a new note
   */
  async createNote(userId: string, title: string, content: string) {
    try {
      if (!title || !content) {
        return {
          success: false,
          message: 'Title and content are required',
        };
      }

      const noteRef = firebaseDb.collection('notes').doc();
      const noteData = {
        id: noteRef.id,
        title,
        content,
        user_id: userId,
        created_at: new Date(),
      };

      await noteRef.set(noteData);

      return {
        success: true,
        message: 'Note created successfully',
        note: noteData,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get all notes for a specific user
   */
  async getNotes(userId: string) {
    try {
      const notesSnapshot = await firebaseDb
        .collection('notes')
        .where('user_id', '==', userId)
        .orderBy('created_at', 'desc')
        .get();

      const notes: any[] = [];
      notesSnapshot.forEach((doc) => {
        notes.push(doc.data());
      });

      return {
        success: true,
        notes,
        count: notes.length,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get a specific note by ID
   */
  async getNoteById(noteId: string) {
    try {
      const noteDoc = await firebaseDb.collection('notes').doc(noteId).get();

      if (!noteDoc.exists) {
        return {
          success: false,
          message: 'Note not found',
        };
      }

      return {
        success: true,
        note: noteDoc.data(),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Update a note (owner only)
   */
  async updateNote(userId: string, noteId: string, title: string, content: string) {
    try {
      const noteDoc = await firebaseDb.collection('notes').doc(noteId).get();

      if (!noteDoc.exists) {
        return {
          success: false,
          message: 'Note not found',
        };
      }

      const noteData = noteDoc.data();

      // Check if user is the owner
      if (!noteData || noteData.user_id !== userId) {
        return {
          success: false,
          message: 'Unauthorized: You can only update your own notes',
        };
      }

      await firebaseDb.collection('notes').doc(noteId).update({
        title: title || noteData.title,
        content: content || noteData.content,
        updated_at: new Date(),
      });

      return {
        success: true,
        message: 'Note updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Delete a note (owner only)
   */
  async deleteNote(userId: string, noteId: string) {
    try {
      const noteDoc = await firebaseDb.collection('notes').doc(noteId).get();

      if (!noteDoc.exists) {
        return {
          success: false,
          message: 'Note not found',
        };
      }

      const noteData = noteDoc.data();

      // Check if user is the owner
      if (!noteData || noteData.user_id !== userId) {
        return {
          success: false,
          message: 'Unauthorized: You can only delete your own notes',
        };
      }

      await firebaseDb.collection('notes').doc(noteId).delete();

      return {
        success: true,
        message: 'Note deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
