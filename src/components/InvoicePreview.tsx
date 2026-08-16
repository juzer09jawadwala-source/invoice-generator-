import React, { forwardRef } from 'react';
import { Invoice } from '../types';
import { formatCurrency } from '../lib/utils';
import { calculateInvoice } from '../lib/calc';
import { QRCodeCanvas } from 'qrcode.react';

interface Props {
  invoice: Invoice;
}

export const InvoicePreview = forwardRef<HTMLDivElement, Props>(({ invoice }, ref) => {
  const totals = calculateInvoice(invoice);
  const currency = invoice.currency || 'INR';

  return (
    <div
      ref={ref}
      style={{
        backgroundColor: '#FFFFFF',
        backgroundImage: 'url(/invoice-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: '#111111',
        width: '210mm',
        minHeight: '297mm',
        margin: '0 auto',
        padding: '30mm 30mm 20mm 30mm',
        boxSizing: 'border-box',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
      className="relative flex flex-col justify-between"
    >
      <div>
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '36px' }}>
          <div>
            {invoice.company.logoUrl ? (
              <img
                src={invoice.company.logoUrl}
                alt="Company Logo"
                style={{ maxHeight: '56px', maxWidth: '160px', objectFit: 'contain', marginBottom: '16px' }}
              />
            ) : (
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  backgroundColor: '#111111',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '20px',
                  letterSpacing: '-0.03em',
                }}
              >
                NL
              </div>
            )}
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111111', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
              {invoice.company.name || 'Noir Labs'}
            </h1>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 10px 0' }}>
              Digital Design & Engineering Studio
            </p>

            <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: '1.5' }}>
              {invoice.company.address && <div>{invoice.company.address}</div>}
              <div>
                {invoice.company.email} {invoice.company.phone && `• ${invoice.company.phone}`}
              </div>
              {invoice.company.website && <div>{invoice.company.website}</div>}
              {invoice.company.gstNumber && (
                <div style={{ marginTop: '4px', fontWeight: 500, color: '#4B5563' }}>
                  GSTIN: {invoice.company.gstNumber}
                </div>
              )}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#111111', margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>
              INVOICE
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '4px 16px', fontSize: '13px', textAlign: 'right' }}>
              <span style={{ color: '#6B7280' }}>Invoice No:</span>
              <span style={{ fontWeight: 600, color: '#111111' }}>{invoice.invoiceNumber}</span>

              <span style={{ color: '#6B7280' }}>Issue Date:</span>
              <span style={{ fontWeight: 500, color: '#111111' }}>
                {invoice.invoiceDate
                  ? new Date(invoice.invoiceDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                  : '-'}
              </span>

              <span style={{ color: '#6B7280' }}>Due Date:</span>
              <span style={{ fontWeight: 500, color: '#111111' }}>
                {invoice.dueDate
                  ? new Date(invoice.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                  : '-'}
              </span>

              <span style={{ color: '#6B7280' }}>Status:</span>
              <span
                style={{
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  fontSize: '11px',
                  color:
                    invoice.status === 'paid'
                      ? '#0D9488'
                      : invoice.status === 'pending'
                      ? '#D97706'
                      : invoice.status === 'overdue'
                      ? '#E11D48'
                      : '#6B7280',
                }}
              >
                {invoice.status || 'pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Bill To & Project Info */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: '16px 0',
            borderTop: '1px solid #E5E7EB',
            borderBottom: '1px solid #E5E7EB',
            marginBottom: '28px',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', fontWeight: 600, marginBottom: '6px' }}>
              Billed To
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#111111' }}>
              {invoice.client.companyName || invoice.client.name || 'Client Name'}
            </div>
            {invoice.client.name && invoice.client.companyName && (
              <div style={{ fontSize: '13px', color: '#4B5563', marginTop: '2px' }}>
                Attn: {invoice.client.name}
              </div>
            )}
            <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px', maxWidth: '280px', lineHeight: '1.4' }}>
              {invoice.client.address && <div>{invoice.client.address}</div>}
              {(invoice.client.email || invoice.client.phone) && (
                <div style={{ marginTop: '2px' }}>
                  {invoice.client.email} {invoice.client.phone && `• ${invoice.client.phone}`}
                </div>
              )}
            </div>
          </div>

          {invoice.client.projectName && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', fontWeight: 600, marginBottom: '6px' }}>
                Project Reference
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#111111' }}>
                {invoice.client.projectName}
              </div>
            </div>
          )}
        </div>

        {/* Items Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '28px', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #111111', textAlign: 'left' }}>
              <th style={{ padding: '8px 0', fontWeight: 600, color: '#111111', width: '45%' }}>Service & Description</th>
              <th style={{ padding: '8px 8px', fontWeight: 600, color: '#111111', textAlign: 'center', width: '10%' }}>Qty</th>
              <th style={{ padding: '8px 8px', fontWeight: 600, color: '#111111', textAlign: 'right', width: '15%' }}>Rate</th>
              <th style={{ padding: '8px 8px', fontWeight: 600, color: '#111111', textAlign: 'center', width: '10%' }}>Tax</th>
              <th style={{ padding: '8px 0', fontWeight: 600, color: '#111111', textAlign: 'right', width: '20%' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {(invoice.items || []).map((item, idx) => {
              const lineCalc = totals.lineCalculations.find((l) => l.id === item.id);
              const lineTotal = lineCalc ? lineCalc.total : item.quantity * item.rate * (1 + (item.taxPercent || 18) / 100);

              return (
                <tr key={item.id || idx} style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <td style={{ padding: '12px 0', verticalAlign: 'top' }}>
                    <div style={{ fontWeight: 600, color: '#111111' }}>{item.name}</div>
                    {item.description && (
                      <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px', lineHeight: '1.4' }}>
                        {item.description}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', color: '#4B5563', verticalAlign: 'top' }}>
                    {item.quantity}
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'right', color: '#4B5563', verticalAlign: 'top' }}>
                    {formatCurrency(item.rate, currency)}
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', color: '#6B7280', verticalAlign: 'top', fontSize: '12px' }}>
                    {item.taxPercent || 0}%
                  </td>
                  <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 600, color: '#111111', verticalAlign: 'top' }}>
                    {formatCurrency(lineTotal, currency)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Totals Summary */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
          <div style={{ width: '260px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', color: '#6B7280' }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: 500, color: '#111111' }}>{formatCurrency(totals.subtotal, currency)}</span>
            </div>

            {totals.itemDiscounts > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', color: '#DC2626' }}>
                <span>Discount</span>
                <span style={{ fontWeight: 500 }}>-{formatCurrency(totals.itemDiscounts, currency)}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', color: '#6B7280' }}>
              <span>GST ({totals.effectiveTaxRate.toFixed(0)}%)</span>
              <span style={{ fontWeight: 500, color: '#111111' }}>{formatCurrency(totals.taxTotal, currency)}</span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                marginTop: '6px',
                borderTop: '1px solid #E5E7EB',
                borderBottom: '2px solid #111111',
                fontSize: '16px',
                fontWeight: 700,
                color: '#111111',
              }}
            >
              <span>Grand Total</span>
              <span>{formatCurrency(totals.grandTotal, currency)}</span>
            </div>

            {totals.advancePaid > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', color: '#6B7280' }}>
                <span>Advance Paid</span>
                <span style={{ fontWeight: 500, color: '#111111' }}>-{formatCurrency(totals.advancePaid, currency)}</span>
              </div>
            )}

            {totals.advancePaid > 0 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  marginTop: '4px',
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#0D9488',
                }}
              >
                <span>Balance Due</span>
                <span>{formatCurrency(totals.balanceDue, currency)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Payment Schedule & Notes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '28px' }}>
          {invoice.paymentSchedule && invoice.paymentSchedule.length > 0 && (
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', fontWeight: 600, marginBottom: '8px' }}>
                Payment Schedule
              </div>
              <div style={{ fontSize: '12px', color: '#4B5563' }}>
                {invoice.paymentSchedule.map((pm) => (
                  <div key={pm.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                    <span>
                      {pm.percentage}% {pm.description}
                    </span>
                    <span style={{ fontWeight: 600, color: '#111111' }}>
                      {formatCurrency(totals.grandTotal * (pm.percentage / 100), currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {invoice.notes && (
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', fontWeight: 600, marginBottom: '8px' }}>
                Notes
              </div>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: 0, lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                {invoice.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Terms & Conditions & Signatory */}
      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
        <div style={{ maxWidth: '65%' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', fontWeight: 600, marginBottom: '6px' }}>
            Terms & Conditions
          </div>
          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', color: '#6B7280', lineHeight: '1.4' }}>
            {(invoice.terms || []).map((term, i) => (
              <li key={i}>{term}</li>
            ))}
          </ul>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <QRCodeCanvas
              value={
                invoice.company.upiId
                  ? `upi://pay?pa=${encodeURIComponent(invoice.company.upiId)}&pn=${encodeURIComponent(
                      invoice.company.name || 'Noir Labs'
                    )}&am=${totals.balanceDue}&cu=INR&tn=${encodeURIComponent('Invoice ' + invoice.invoiceNumber)}`
                  : invoice.company.website
                  ? `https://${invoice.company.website}`
                  : `mailto:${invoice.company.email}`
              }
              size={68}
              bgColor="#ffffff"
              fgColor="#111111"
              level="M"
              includeMargin={false}
            />
            <div style={{ fontSize: '9px', color: '#4B5563', marginTop: '4px', fontWeight: 600 }}>
              {invoice.company.upiId ? 'Scan to Pay via UPI' : 'Scan to Verify'}
            </div>
            {invoice.company.upiId && (
              <div style={{ fontSize: '8px', color: '#6B7280', fontFamily: 'monospace' }}>
                {invoice.company.upiId}
              </div>
            )}
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ width: '120px', borderBottom: '1px solid #D1D5DB', marginBottom: '6px' }} />
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#111111' }}>Authorized Signatory</div>
            <div style={{ fontSize: '10px', color: '#9CA3AF' }}>{invoice.company.name || 'Noir Labs'}</div>
          </div>
        </div>
      </div>
    </div>
  );
});
