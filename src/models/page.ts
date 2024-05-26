import { Schema, model, Document } from 'mongoose';

interface IPage extends Document {
  bookId: string;
  pageId: string;
  title: string;
  content?: string;
}

const pageSchema = new Schema({
  bookId: { type: String, required: true },
  pageId: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: false }
});

const Page = model<IPage>('Page', pageSchema);

export { Page, IPage };
