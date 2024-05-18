import mongoose from 'mongoose';
import { Book } from '../models/book';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookReader';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');

    const sampleBook = new Book({
      title: 'Sample Book',
      author: 'Author Name',
      pages: [
        { number: 1, content: 'Content of page 1' },
        { number: 2, content: 'Content of page 2' },
        { number: 3, content: 'Content of page 3' },
      ],
    });

    await sampleBook.save();
    console.log('Sample book added to the database');

    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });
