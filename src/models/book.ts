import { Schema, model, Document } from 'mongoose';

interface IBook extends Document {
  title: string;
  author: string;
  pages: { number: number; content: string }[];
}

const pageSchema = new Schema({
  number: { type: Number, required: true },
  content: { type: String, required: true }
});

const bookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  pages: [pageSchema]
});

const Book = model<IBook>('Book', bookSchema);

export { Book, IBook };
