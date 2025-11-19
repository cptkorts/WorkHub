import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import Invoice from "@/lib/models/Invoice";

// GET all invoices for the logged-in user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get query parameters for filtering
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const query: { userId: string; status?: string } = {
      userId: session.user.id,
    };
    if (status) {
      query.status = status;
    }

    const invoices = await Invoice.find(query).sort({ createdAt: -1 });
    return NextResponse.json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}

// POST create a new invoice
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const {
      clientId,
      invoiceNumber,
      items,
      subtotal,
      tax,
      total,
      status,
      dueDate,
      notes,
    } = body;

    // Validate required fields
    if (
      !clientId ||
      !invoiceNumber ||
      !items ||
      items.length === 0 ||
      subtotal === undefined ||
      tax === undefined ||
      total === undefined ||
      !dueDate
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the invoice
    const invoice = await Invoice.create({
      userId: session.user.id,
      clientId,
      invoiceNumber,
      items,
      subtotal,
      tax,
      total,
      status: status || "unpaid",
      dueDate: new Date(dueDate),
      notes,
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating invoice:", error);

    // Handle duplicate invoice number
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        { error: "Invoice number already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}
