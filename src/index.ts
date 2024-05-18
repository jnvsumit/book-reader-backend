import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import bookRoutes from './routes/bookRoutes';
import donationRoutes from './routes/donationRoutes';
import authRoutes from './routes/authRoutes';
import config from 'config';

const app = express();
const PORT = config.get<number>('port');
const MONGODB_URI = config.get<string>('mongodbUri');

app.use(bodyParser.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/donations', donationRoutes);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });
