import { Request, Response } from 'express';
import { Book, IBook } from '../models/book';
import { Page, IPage } from '../models/page';
import logger from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

// Add a new page to a book
export const addPage = async (req: Request, res: Response) => {
  const { bookId } = req.params;
  const { title, content } = req.body;

  try {
    const book = await Book.findOne({ bookId });

    if (!book) {
      logger.warn(`Book not found for bookId: ${bookId}`);
      return res.status(404).json({ message: 'Book not found', error: { errorCode: "NOT_FOUND", message: 'Book not found' } });
    }

    const newPage: IPage = new Page({
      bookId,
      pageId: uuidv4(),
      title,
      content
    });
    await newPage.save();

    logger.info('Page added successfully');

    res.status(201).json({
      message: "Page added successfully",
      data: {
        bookId,
        pageId: newPage.pageId,
        title,
        content
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error adding page: ${error.message}`);
      res.status(500).json({ message: error.message, error: { errorCode: "INTERNAL_SERVER_ERROR", message: error.message } });
    } else {
      logger.error('Error adding page: An unknown error occurred');
      res.status(500).json({ message: 'An unknown error occurred', error: { errorCode: "INTERNAL_SERVER_ERROR", message: 'An unknown error occurred' } });
    }
  }
};

// Get pages by bookId with pagination
export const getPagesByBookId = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const { pageNumber, pageSize }: { pageNumber?: string; pageSize?: string; } = req.query;

    const page = parseInt(pageNumber || "1", 10);
    const size = parseInt(pageSize || "10", 10);

    if (isNaN(page) || isNaN(size) || page < 1 || size < 1) {
      res.status(400).json({ message: 'Invalid pagination parameters', error: { errorCode: "BAD_REQUEST", message: 'Invalid pagination parameters' } });
      return;
    }

    const skip = (page - 1) * size;
    const totalPages = await Page.countDocuments({ bookId });
    const pages = await Page.find({ bookId }).skip(skip).limit(size);

    logger.info('Pages fetched successfully');
    res.status(200).json({
      message: 'Pages fetched successfully',
      data: {
        count: totalPages,
        pages: pages.map(page => ({
          pageId: page.pageId,
          title: page.title,
          content: page.content
        })),
        page,
        pageSize: size,
        totalPages: Math.ceil(totalPages / size)
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error fetching pages: ${error.message}`);
      res.status(500).json({ message: error.message, error: { errorCode: "INTERNAL_SERVER_ERROR", message: error.message } });
    } else {
      logger.error('Error fetching pages: An unknown error occurred');
      res.status(500).json({ message: 'An unknown error occurred', error: { errorCode: "INTERNAL_SERVER_ERROR", message: 'An unknown error occurred' } });
    }
  }
};

// Get a single page by pageId
export const getPageById = async (req: Request, res: Response) => {
  try {
    const { pageId } = req.params;
    const page = await Page.findOne({ pageId });

    if (page) {
      logger.info(`Page details fetched for pageId: ${pageId}`);
      res.status(200).json({
        message: "Page details fetched",
        data: {
          bookId: page.bookId,
          title: page.title,
          pageId: page.pageId,
          content: page.content
        }
      });
    } else {
      logger.warn(`Page not found for pageId: ${pageId}`);
      res.status(404).json({ message: 'Page not found', error: { errorCode: "NOT_FOUND", message: 'Page not found' } });
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error fetching page details: ${error.message}`);
      res.status(500).json({ message: error.message, error: { errorCode: "INTERNAL_SERVER_ERROR", message: error.message } });
    } else {
      logger.error('Error fetching page details: An unknown error occurred');
      res.status(500).json({ message: 'An unknown error occurred', error: { errorCode: "INTERNAL_SERVER_ERROR", message: 'An unknown error occurred' } });
    }
  }
};

// Update a page's details
export const updatePage = async (req: Request, res: Response) => {
  try {
    const { pageId } = req.params;
    const { title, content } = req.body;
    
    const updateObj: { [key: string]: string } = {};
    if (title) updateObj['title'] = title;
    if (content) updateObj['content'] = content;

    const page = await Page.findOneAndUpdate({ pageId }, { $set: updateObj }, { new: true });

    if (page) {
      logger.info(`Page updated for pageId: ${pageId}`);
      res.status(200).json({
        message: "Page updated successfully",
        data: {
          pageId: page.pageId,
          bookId: page.bookId,
          title: page.title,
          content: page.content
        }
      });
    } else {
      logger.warn(`Page not found for pageId: ${pageId}`);
      res.status(404).json({ message: 'Page not found', error: { errorCode: "NOT_FOUND", message: 'Page not found' } });
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error updating page: ${error.message}`);
      res.status(500).json({ message: error.message, error: { errorCode: "INTERNAL_SERVER_ERROR", message: error.message } });
    } else {
      logger.error('Error updating page: An unknown error occurred');
      res.status(500).json({ message: 'An unknown error occurred', error: { errorCode: "INTERNAL_SERVER_ERROR", message: 'An unknown error occurred' } });
    }
  }
};

// Delete a page
export const deletePage = async (req: Request, res: Response) => {
  const { pageId } = req.params;

  try {
    const page = await Page.findOneAndDelete({ pageId });

    if (page) {
      logger.info(`Page deleted successfully for pageId: ${pageId}`);
      res.status(200).json({ message: 'Page deleted successfully' });
    } else {
      logger.warn(`Page not found for pageId: ${pageId}`);
      res.status(404).json({ message: 'Page not found', error: { errorCode: "NOT_FOUND", message: 'Page not found' } });
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error deleting page: ${error.message}`);
      res.status(500).json({ message: error.message, error: { errorCode: "INTERNAL_SERVER_ERROR", message: error.message } });
    } else {
      logger.error('Error deleting page: An unknown error occurred');
      res.status(500).json({ message: 'An unknown error occurred', error: { errorCode: "INTERNAL_SERVER_ERROR", message: 'An unknown error occurred' } });
    }
  }
};
