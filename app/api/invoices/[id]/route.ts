import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Invoice from "@/lib/models/Invoice";

// GET a single invoice
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const invoice = await Invoice.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoice" },
      { status: 500 }
    );
  }
}

// PUT update an invoice
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
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
      paidDate,
      notes,
    } = body;

    // Find invoice and check ownership
    const invoice = await Invoice.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Update fields
    if (clientId !== undefined) invoice.clientId = clientId;
    if (invoiceNumber !== undefined) invoice.invoiceNumber = invoiceNumber;
    if (items !== undefined) invoice.items = items;
    if (subtotal !== undefined) invoice.subtotal = subtotal;
    if (tax !== undefined) invoice.tax = tax;
    if (total !== undefined) invoice.total = total;
    if (status !== undefined) {
      invoice.status = status;
      // Set paidDate when marked as paid
      if (status === "paid" && !invoice.paidDate) {
        invoice.paidDate = new Date();
      }
      // Clear paidDate when marked as unpaid
      if (status === "unpaid") {
        invoice.paidDate = undefined;
      }
    }
    if (dueDate !== undefined) invoice.dueDate = new Date(dueDate);
    if (paidDate !== undefined)
      invoice.paidDate = paidDate ? new Date(paidDate) : undefined;
    if (notes !== undefined) invoice.notes = notes;

    await invoice.save();

    return NextResponse.json(invoice);
  } catch (error: unknown) {
    console.error("Error updating invoice:", error);

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
      { error: "Failed to update invoice" },
      { status: 500 }
    );
  }
}

// DELETE an invoice
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const invoice = await Invoice.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json(
      { error: "Failed to delete invoice" },
      { status: 500 }
    );
  }
}
