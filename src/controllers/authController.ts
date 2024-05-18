import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user';

const secret = process.env.JWT_SECRET || 'secret';
const registrationToken = process.env.REGISTRATION_TOKEN || 'static_registration_token';

export const register = async (req: Request, res: Response) => {
  const { username, password, role } = req.body;
  const token = req.header('Registration-Token');

  if (token !== registrationToken) {
    return res.status(401).json({ message: 'Invalid registration token' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid password' });
    
    const token = jwt.sign({ userId: user._id, role: user.role }, secret, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};
