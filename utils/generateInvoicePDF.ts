import jsPDF from "jspdf";
import { Invoice, Client } from "@/hooks/useInvoiceDetail";

export const generateInvoicePDF = (invoice: Invoice, client: Client) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Header
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", pageWidth / 2, yPos, { align: "center" });

  yPos += 15;

  // Invoice Info
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice #: ${invoice.invoiceNumber}`, 20, yPos);
  doc.text(
    `Date: ${new Date(invoice.createdAt).toLocaleDateString()}`,
    pageWidth - 20,
    yPos,
    { align: "right" }
  );

  yPos += 6;
  doc.text(
    `Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`,
    pageWidth - 20,
    yPos,
    { align: "right" }
  );

  yPos += 6;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(
    invoice.status === "paid" ? 0 : 200,
    invoice.status === "paid" ? 150 : 80,
    0
  );
  doc.text(`Status: ${invoice.status.toUpperCase()}`, pageWidth - 20, yPos, {
    align: "right",
  });
  doc.setTextColor(0, 0, 0);

  yPos += 15;

  // Client Info
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("BILL TO:", 20, yPos);

  yPos += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(client.fullName, 20, yPos);

  if (client.businessName) {
    yPos += 5;
    doc.text(client.businessName, 20, yPos);
  }
  if (client.email) {
    yPos += 5;
    doc.text(client.email, 20, yPos);
  }
  if (client.phone) {
    yPos += 5;
    doc.text(client.phone, 20, yPos);
  }
  if (client.address) {
    yPos += 5;
    doc.text(client.address, 20, yPos);
  }

  yPos += 15;

  // Line Items Table
  doc.setFont("helvetica", "bold");
  doc.setFillColor(240, 240, 240);
  doc.rect(20, yPos - 5, pageWidth - 40, 8, "F");

  doc.text("Description", 22, yPos);
  doc.text("Qty", pageWidth - 90, yPos, { align: "right" });
  doc.text("Price", pageWidth - 60, yPos, { align: "right" });
  doc.text("Total", pageWidth - 22, yPos, { align: "right" });

  yPos += 10;
  doc.setFont("helvetica", "normal");

  invoice.items.forEach((item) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }

    doc.text(item.description, 22, yPos);
    doc.text(item.quantity.toString(), pageWidth - 90, yPos, {
      align: "right",
    });
    doc.text(`$${item.price.toFixed(2)}`, pageWidth - 60, yPos, {
      align: "right",
    });
    doc.text(`$${item.total.toFixed(2)}`, pageWidth - 22, yPos, {
      align: "right",
    });

    yPos += 7;
  });

  yPos += 5;

  // Totals
  doc.line(pageWidth - 80, yPos, pageWidth - 20, yPos);
  yPos += 8;

  doc.text("Subtotal:", pageWidth - 60, yPos);
  doc.text(`$${invoice.subtotal.toFixed(2)}`, pageWidth - 22, yPos, {
    align: "right",
  });

  yPos += 6;
  doc.text("Tax:", pageWidth - 60, yPos);
  doc.text(`$${invoice.tax.toFixed(2)}`, pageWidth - 22, yPos, {
    align: "right",
  });

  yPos += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("TOTAL:", pageWidth - 60, yPos);
  doc.text(`$${invoice.total.toFixed(2)}`, pageWidth - 22, yPos, {
    align: "right",
  });

  // Notes
  if (invoice.notes) {
    yPos += 15;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Notes:", 20, yPos);

    yPos += 6;
    doc.setFont("helvetica", "normal");
    const splitNotes = doc.splitTextToSize(invoice.notes, pageWidth - 40);
    doc.text(splitNotes, 20, yPos);
  }

  // Save PDF
  doc.save(`${invoice.invoiceNumber}.pdf`);
};
