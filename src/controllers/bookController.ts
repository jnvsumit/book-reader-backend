import { Request, Response } from 'express';
import { Book, IBook } from '../models/book';

export const createBook = async (req: Request, res: Response) => {
  const { title, author, pages } = req.body;
  const userId = req.user!.userId;

  try {
    const newBook: IBook = new Book({
      title,
      author,
      pages,
      createdBy: userId
    });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};


export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

export const getBookDetails = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

export const getBookPage = async (req: Request, res: Response) => {
  try {
    const { bookId, pageNumber } = req.params;
    const book = await Book.findById(bookId);
    if (book) {
      const page = book.pages.find(page => page.number === parseInt(pageNumber));
      if (page) {
        res.json(page);
      } else {
        res.status(404).json({ message: 'Page not found' });
      }
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

export const updateBookPage = async (req: Request, res: Response) => {
  try {
    const { bookId, pageNumber } = req.params;
    const { content } = req.body;
    const book = await Book.findById(bookId);
    if (book) {
      const page = book.pages.find(page => page.number === parseInt(pageNumber));
      if (page) {
        page.content = content;
        await book.save();
        res.json(page);
      } else {
        res.status(404).json({ message: 'Page not found' });
      }
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  const { bookId } = req.params;
  const userId = req.user!.userId;
  const userRole = req.user!.role;

  try {
    const book: IBook | null = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (book.createdBy.toString() !== userId && userRole !== 'ADMIN') {
      return res.status(403).json({ message: 'Permission Denied' });
    }

    await book.deleteOne({ _id: bookId });
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};
