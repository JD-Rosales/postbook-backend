import express from 'express';
import type { Request, Response } from 'express';
// import { body, validationResult } from 'express-validator';

import * as AuthorService from './author.service';

export const authorRouter = express.Router();

// GET: all Authors
authorRouter.get('/', async (request: Request, response: Response) => {
  try {
    const authors = await AuthorService.listAuthors();
    return response.status(200).json(authors);
  } catch (err: any) {
    return response.status(500).json(err.message);
  }
});

// GET: single author by ID
authorRouter.get('/:id', async (request: Request, response: Response) => {
  try {
    const id: number = parseInt(request.params.id);

    const author = await AuthorService.getAuthor(id);
    if (author) {
      return response.status(200).json(author);
    }
    return response.status(404).json({ message: 'No author found' });
  } catch (err: any) {
    return response.status(500).json(err.message);
  }
});