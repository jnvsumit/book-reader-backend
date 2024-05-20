import express from 'express';
import multer from 'multer';

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; role: string };
    }
  }
}
