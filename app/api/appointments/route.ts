import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/lib/models/Appointment";
import Client from "@/lib/models/Client";
import { isValidObjectId } from "mongoose";

// GET /api/appointments - Get all appointments for the logged-in user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Optional query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    interface QueryFilter {
      userId: string;
      status?: string;
      date?: { $gte: Date; $lte: Date };
    }

    const query: QueryFilter = { userId: session.user.id };

    if (status) {
      query.status = status;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const appointments = await Appointment.find(query).sort({
      date: 1,
      time: 1,
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

// POST /api/appointments - Create a new appointment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();

    // Validate required fields
    if (
      !body.clientId ||
      !body.date ||
      !body.time ||
      !body.service ||
      body.price === undefined
    ) {
      return NextResponse.json(
        { error: "Client, date, time, service, and price are required" },
        { status: 400 }
      );
    }

    // The client must belong to the logged-in user
    if (
      !isValidObjectId(body.clientId) ||
      !(await Client.exists({ _id: body.clientId, userId: session.user.id }))
    ) {
      return NextResponse.json({ error: "Client not found" }, { status: 400 });
    }

    // Create appointment linked to the current user
    const appointment = await Appointment.create({
      userId: session.user.id,
      clientId: body.clientId,
      date: new Date(body.date),
      time: body.time,
      service: body.service,
      price: body.price,
      status: body.status || "upcoming",
      notes: body.notes,
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}
