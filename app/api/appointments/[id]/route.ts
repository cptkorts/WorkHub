import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/lib/models/Appointment";
import Client from "@/lib/models/Client";
import { isValidObjectId } from "mongoose";

// GET /api/appointments/:id - Get a specific appointment
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const appointment = await Appointment.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointment" },
      { status: 500 }
    );
  }
}

// PUT /api/appointments/:id - Update an appointment
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
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

    const appointment = await Appointment.findOneAndUpdate(
      {
        _id: id,
        userId: session.user.id,
      },
      {
        clientId: body.clientId,
        date: new Date(body.date),
        time: body.time,
        service: body.service,
        price: body.price,
        status: body.status,
        notes: body.notes,
      },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}

// DELETE /api/appointments/:id - Delete an appointment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const appointment = await Appointment.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return NextResponse.json(
      { error: "Failed to delete appointment" },
      { status: 500 }
    );
  }
}
