import mongoose, { Document, Model, Schema } from "mongoose";

export interface IClient extends Document {
  _id: string;
  userId: string; // Link to the user who owns this client
  fullName: string;
  businessName?: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema<IClient>(
  {
    userId: {
      type: String,
      required: true,
      index: true, // Index for faster queries
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    businessName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure user can query their clients efficiently
ClientSchema.index({ userId: 1, createdAt: -1 });

// Prevent model recompilation in Next.js hot reload
const Client: Model<IClient> =
  mongoose.models.Client || mongoose.model<IClient>("Client", ClientSchema);

export default Client;
