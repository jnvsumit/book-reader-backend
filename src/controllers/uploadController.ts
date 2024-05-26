import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, 'uploads/');
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage }).single('file');  // Ensure we're using 'file' since frontend appends 'file'

export const uploadFiles = (req: Request, res: Response) => {
  upload(req, res, (err) => {
    console.log(req.file, req.files);
    
    if (err) {
      return res.status(500).json({ message: err.message, error: { errorCode: "INTERNAL_SERVER_ERROR", message: err.message } });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded', error: { errorCode: "BAD_REQUEST", message: 'No file uploaded' } });
    }
    const url = `/uploads/${req.file.filename}`;
    res.status(200).json({ message: 'File uploaded', data: { url } });
  });
};
