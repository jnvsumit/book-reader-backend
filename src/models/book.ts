import { Schema, model, Document } from 'mongoose';
import { IPage } from './page';

interface IBook extends Document {
  bookId: string;
  title: string;
  author: string;
  image: string;
  description: string;
  pages?: IPage[];
}

const bookSchema = new Schema({
  bookId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  image: { type: String, required: false },
  description: { type: String, required: false }
});

const Book = model<IBook>('Book', bookSchema);

export { Book, IBook };
