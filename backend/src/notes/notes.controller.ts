import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import type { Request } from 'express';
import { firebaseAuth } from '../config/firebase.config';

@Controller('api/notes')
export class NotesController {
  constructor(private notesService: NotesService) {}

  /**
   * Extract and verify user ID from authorization header
   */
  private async getUserIdFromRequest(request: Request): Promise<string> {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = await firebaseAuth.verifyIdToken(token);
      return decodedToken.uid;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  /**
   * POST /api/notes
   * Create a new note
   */
  @Post()
  async createNote(
    @Req() request: Request,
    @Body() body?: { title: string; content: string },
  ) {
    const userId = await this.getUserIdFromRequest(request);

    // Validate body exists
    if (!body || !body.title || !body.content) {
      return {
        success: false,
        message: 'Title and content are required',
      };
    }

    const { title, content } = body;
    return await this.notesService.createNote(userId, title, content);
  }

  /**
   * GET /api/notes
   * Get all notes for the logged-in user
   */
  @Get()
  async getNotes(@Req() request: Request) {
    const userId = await this.getUserIdFromRequest(request);
    return await this.notesService.getNotes(userId);
  }

  /**
   * GET /api/notes/:id
   * Get a specific note by ID
   */
  @Get(':id')
  async getNoteById(@Req() request: Request, @Param('id') noteId: string) {
    const userId = await this.getUserIdFromRequest(request);
    const result = await this.notesService.getNoteById(noteId);

    if (!result.success) {
      return result;
    }

    // Verify user owns this note
    if (result.note && result.note.user_id !== userId) {
      throw new UnauthorizedException(
        'Unauthorized: You can only view your own notes',
      );
    }

    return result;
  }

  /**
   * PUT /api/notes/:id
   * Update a note
   */
  @Put(':id')
  async updateNote(
    @Req() request: Request,
    @Param('id') noteId: string,
    @Body() body?: { title: string; content: string },
  ) {
    const userId = await this.getUserIdFromRequest(request);
    
    // Validate body exists
    if (!body || (!body.title && !body.content)) {
      return {
        success: false,
        message: 'At least one of title or content is required',
      };
    }

    const { title, content } = body;
    return await this.notesService.updateNote(userId, noteId, title, content);
  }

  /**
   * DELETE /api/notes/:id
   * Delete a note
   */
  @Delete(':id')
  async deleteNote(@Req() request: Request, @Param('id') noteId: string) {
    const userId = await this.getUserIdFromRequest(request);
    return await this.notesService.deleteNote(userId, noteId);
  }
}
