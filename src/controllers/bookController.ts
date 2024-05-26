import { Request, Response } from 'express';
import { Book, IBook } from '../models/book';
import logger from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';
import { Page } from '../models/page';

export const postBook = async (req: Request, res: Response) => {
  const { title, author, image, description } = req.body;

  try {
    const newBook: IBook = new Book({
      bookId: uuidv4(),
      title,
      author,
      image,
      description,
      pages: []
    });
    await newBook.save();

    logger.info('Book created successfully');

    res.status(201).json({
      message: "Book added successfully",
      data: {
        bookId: newBook.bookId,
        title,
        author,
        image,
        description,
        pages: newBook.pages || [],
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error creating book: ${error.message}`);
      res.status(500).json({ message: error.message, error: { errorCode: "INTERNAL_SERVER_ERROR", message: error.message } });
    } else {
      logger.error('Error creating book: An unknown error occurred');
      res.status(500).json({ message: 'An unknown error occurred', error: { errorCode: "INTERNAL_SERVER_ERROR", message: 'An unknown error occurred' } });
    }
  }
};

export const getBooks = async (req: Request, res: Response) => {
  try {
    const { pageNumber, pageSize } : { pageNumber?: string; pageSize?: string; } = req.query;

    const page = parseInt(pageNumber || "1", 10);
    const size = parseInt(pageSize || "10", 10);

    if (isNaN(page) || isNaN(size) || page < 1 || size < 1) {
      res.status(400).json({ message: 'Invalid pagination parameters', error: { errorCode: "BAD_REQUEST", message: 'Invalid pagination parameters' } });
      return;
    }

    const skip = (page - 1) * size;
    const totalBooks = await Book.countDocuments();
    const books = await Book.find().skip(skip).limit(size);

    logger.info('Books fetched successfully');
    res.status(200).json({
      message: 'Books fetched successfully',
      data: {
        count: totalBooks,
        books: books.map(book => ({
          bookId: book.bookId,
          title: book.title,
          author: book.author,
          image: book.image,
          description: book.description
        })),
        page,
        pageSize: size,
        totalPages: Math.ceil(totalBooks / size)
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error fetching books: ${error.message}`);
      res.status(500).json({ message: error.message, error: { errorCode: "INTERNAL_SERVER_ERROR", message: error.message } });
    } else {
      logger.error('Error fetching books: An unknown error occurred');
      res.status(500).json({ message: 'An unknown error occurred', error: { errorCode: "INTERNAL_SERVER_ERROR", message: 'An unknown error occurred' } });
    }
  }
};

export const getBookDetails = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findOne({ bookId });

    if (book) {
      const pages = await Page.find({ bookId});
      logger.info(`Book details fetched for bookId: ${bookId}`);
      res.status(200).json({
        message: "Book details fetched",
        data: {
          bookId: book.bookId,
          title: book.title,
          author: book.author,
          image: book.image,
          description: book.description,
          pages: pages.map(page => {
            return {
              pageId: page.pageId,
              title: page.title
            }
          }),
        }
      });
    } else {
      logger.warn(`Book not found for bookId: ${bookId}`);
      res.status(404).json({ message: 'Book not found', error: { errorCode: "NOT_FOUND", message: 'Book not found' } });
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error fetching book details: ${error.message}`);
      res.status(500).json({ message: error.message, error: { errorCode: "INTERNAL_SERVER_ERROR", message: error.message } });
    } else {
      logger.error('Error fetching book details: An unknown error occurred');
      res.status(500).json({ message: 'An unknown error occurred', error: { errorCode: "INTERNAL_SERVER_ERROR", message: 'An unknown error occurred' } });
    }
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const { title, description } = req.body;
    const book = await Book.findOne({ bookId });
    
    const updateObj: { [key: string]: string } = {};

    if (title) {
      updateObj['title'] = title;
    }

    if (description) {
      updateObj['description'] = description;
    }

    if (book) {
      await Book.updateOne({ bookId }, {
        $set: { ...updateObj }
      });

      logger.info(`Book updated for bookId: ${bookId}`);
      const updatedBook = await Book.findOne({ bookId });

      if (!updateBook) {
        logger.warn(`Book not found for bookId: ${bookId}`);
        return res.status(404).json({ message: 'Book not found', error: { errorCode: "NOT_FOUND", message: 'Book not found' } });
      }
      
      res.status(200).json({
        message: "Book details fetched",
        data: {
          bookId: updatedBook?.bookId,
          title: updatedBook?.title,
          author: updatedBook?.author,
          image: updatedBook?.image,
          description: updatedBook?.description,
          pages: updatedBook?.pages || [],
        }
      });
    } else {
      logger.warn(`Book not found for bookId: ${bookId}`);
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error updating book: ${error.message}`);
      res.status(500).json({ error: error.message });
    } else {
      logger.error('Error updating book: An unknown error occurred');
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  const { bookId } = req.params;

  try {
    const book: IBook | null = await Book.findOne({ bookId });
    if (!book) {
      logger.warn(`Book not found for bookId: ${bookId}`);
      return res.status(404).json({ message: 'Book not found' });
    }

    await book.deleteOne();
    logger.info(`Book deleted successfully for bookId: ${bookId}`);
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error deleting book: ${error.message}`);
      res.status(500).json({ error: error.message });
    } else {
      logger.error('Error deleting book: An unknown error occurred');
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};
