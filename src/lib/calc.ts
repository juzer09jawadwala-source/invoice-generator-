import { Invoice, InvoiceTotals } from '../types';

export function calculateInvoice(invoice: Invoice): InvoiceTotals {
  const items = invoice.items || [];
  const invoiceDiscount = Number(invoice.discount) || 0;
  const advancePaid = Number(invoice.advancePaid) || 0;

  // 1. Calculate per-line gross, line-level discount, and net
  const lineDetails = items.map((item) => {
    const qty = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    const discountPercent = Number(item.discountPercent) || 0;
    const taxPercent = Number(item.taxPercent) || 0;

    const gross = qty * rate;
    const discount = gross * (discountPercent / 100);
    const net = Math.max(0, gross - discount);

    return {
      id: item.id,
      gross,
      discount,
      net,
      taxPercent,
    };
  });

  const sumLineGross = lineDetails.reduce((sum, l) => sum + l.gross, 0);
  const sumLineDiscount = lineDetails.reduce((sum, l) => sum + l.discount, 0);
  const sumLineNet = lineDetails.reduce((sum, l) => sum + l.net, 0);

  // 2. Allocate invoice-level flat discount pro-rata across lines
  const lineCalculations = lineDetails.map((line) => {
    const allocatedDiscount = sumLineNet > 0 ? invoiceDiscount * (line.net / sumLineNet) : 0;
    const taxable = Math.max(0, line.net - allocatedDiscount);
    const tax = taxable * (line.taxPercent / 100);
    const total = taxable + tax;

    return {
      id: line.id,
      gross: line.gross,
      discount: line.discount + allocatedDiscount,
      net: line.net,
      taxable,
      tax,
      total,
    };
  });

  const subtotal = sumLineGross;
  const itemDiscounts = sumLineDiscount;
  const taxableAmount = lineCalculations.reduce((sum, l) => sum + l.taxable, 0);
  const taxTotal = lineCalculations.reduce((sum, l) => sum + l.tax, 0);
  const grandTotal = taxableAmount + taxTotal;
  const balanceDue = Math.max(0, grandTotal - advancePaid);
  const effectiveTaxRate = taxableAmount > 0 ? (taxTotal / taxableAmount) * 100 : 0;

  return {
    subtotal,
    itemDiscounts,
    taxableAmount,
    taxTotal,
    grandTotal,
    advancePaid,
    balanceDue,
    effectiveTaxRate,
    lineCalculations,
  };
}
