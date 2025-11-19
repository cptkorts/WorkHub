interface InvoiceStatusProps {
  paid: { count: number; total: number };
  unpaid: { count: number; total: number };
}

export default function InvoiceStatus({ paid, unpaid }: InvoiceStatusProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-default mb-4">
        Invoice Status
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-money/20 rounded-lg">
          <div>
            <p className="text-sm font-medium text-text-muted">Paid Invoices</p>
            <p className="text-2xl font-bold text-hover">{paid.count}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-text-muted">Total</p>
            <p className="text-xl font-semibold text-hover">
              ${paid.total.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-error/15 rounded-lg">
          <div>
            <p className="text-sm font-medium text-text-muted">
              Unpaid Invoices
            </p>
            <p className="text-2xl font-bold text-error">{unpaid.count}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-text-muted">Outstanding</p>
            <p className="text-xl font-semibold text-error">
              ${unpaid.total.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
