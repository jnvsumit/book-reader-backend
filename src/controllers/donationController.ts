import { Request, Response } from 'express';
import { Donation } from '../models/donation';

export const createDonation = async (req: Request, res: Response) => {
  try {
    const { amount, donorName, message } = req.body;
    const donation = new Donation({ amount, donorName, message });
    await donation.save();
    res.status(201).json(donation);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

export const getDonations = async (req: Request, res: Response) => {
  try {
    const donations = await Donation.find();
    res.json(donations);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};
