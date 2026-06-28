import { Schema, model, Model } from 'mongoose';
import { IContact } from '@/contact/contact.types';

const ContactSchema = new Schema<IContact>({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true
});

export const ContactModel: Model<IContact> = model<IContact>('Contact', ContactSchema);
