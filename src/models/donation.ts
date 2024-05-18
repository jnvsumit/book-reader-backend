import { Schema, model, Document } from 'mongoose';

interface IDonation extends Document {
  amount: number;
  donorName: string;
  message?: string;
}

const donationSchema = new Schema({
  amount: { type: Number, required: true },
  donorName: { type: String, required: true },
  message: { type: String }
});

const Donation = model<IDonation>('Donation', donationSchema);

export { Donation, IDonation };
