import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAppointment extends Document {
  _id: string;
  userId: string; // The user who owns this appointment
  clientId: string; // Link to the client
  date: Date; // Appointment date
  time: string; // Appointment time (e.g., "14:30")
  service: string; // Service description
  price: number; // Service price
  status: "upcoming" | "completed" | "canceled";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    clientId: {
      type: String,
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    time: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["upcoming", "completed", "canceled"],
      default: "upcoming",
      index: true,
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

// Compound indexes for efficient queries
AppointmentSchema.index({ userId: 1, date: -1 });
AppointmentSchema.index({ userId: 1, status: 1, date: -1 });

// Prevent model recompilation in Next.js hot reload
const Appointment: Model<IAppointment> =
  mongoose.models.Appointment ||
  mongoose.model<IAppointment>("Appointment", AppointmentSchema);

export default Appointment;
