import React, { forwardRef, useState } from 'react';
import { Invoice } from '../types';
import { formatCurrency } from '../lib/utils';
import { calculateInvoice } from '../lib/calc';
import { QRCodeCanvas } from 'qrcode.react';
import { ModelLogo } from './ModelLogo';

interface Props {
  invoice: Invoice;
}

export const InvoicePreview = forwardRef<HTMLDivElement, Props>(({ invoice }, ref) => {
  const totals = calculateInvoice(invoice);
  const currency = invoice.currency || 'INR';
  const [isQrExpanded, setIsQrExpanded] = useState(false);

  return (
    <>
    <div
      ref={ref}
      style={{
        backgroundColor: 'var(--color-off-white)',
        backgroundImage: 'url(/invoice-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: 'var(--color-black)',
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
            <ModelLogo style={{ width: '80px', height: '80px', marginBottom: '12px' }} />
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-black)', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
              {invoice.company.name || 'Noir Labs'}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--color-gray)', margin: '0 0 10px 0' }}>
              Digital Design & Engineering Studio
            </p>

            <div style={{ fontSize: '12px', color: 'var(--color-gray)', lineHeight: '1.5' }}>
              {invoice.company.address && <div>{invoice.company.address}</div>}
              <div>
                {invoice.company.email} {invoice.company.phone && `• ${invoice.company.phone}`}
              </div>
              {invoice.company.website && <div>{invoice.company.website}</div>}
              {invoice.company.gstNumber && (
                <div style={{ marginTop: '4px', fontWeight: 500, color: 'var(--color-graphite)' }}>
                  GSTIN: {invoice.company.gstNumber}
                </div>
              )}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-black)', margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>
              INVOICE
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '4px 16px', fontSize: '13px', textAlign: 'right' }}>
              <span style={{ color: 'var(--color-gray)' }}>Invoice No:</span>
              <span style={{ fontWeight: 600, color: 'var(--color-black)' }}>{invoice.invoiceNumber}</span>

              <span style={{ color: 'var(--color-gray)' }}>Issue Date:</span>
              <span style={{ fontWeight: 500, color: 'var(--color-black)' }}>
                {invoice.invoiceDate
                  ? new Date(invoice.invoiceDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                  : '-'}
              </span>

              <span style={{ color: 'var(--color-gray)' }}>Due Date:</span>
              <span style={{ fontWeight: 500, color: 'var(--color-black)' }}>
                {invoice.dueDate
                  ? new Date(invoice.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                  : '-'}
              </span>

              <span style={{ color: 'var(--color-gray)' }}>Status:</span>
              <span
                style={{
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  fontSize: '11px',
                  color:
                    invoice.status === 'paid'
                      ? 'var(--color-black)'
                      : invoice.status === 'pending'
                      ? 'var(--color-gray)'
                      : invoice.status === 'overdue'
                      ? 'var(--color-graphite)'
                      : 'var(--color-gray)',
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
            borderTop: '1px solid var(--color-light-gray)',
            borderBottom: '1px solid var(--color-light-gray)',
            marginBottom: '28px',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-soft-gray)', fontWeight: 600, marginBottom: '6px' }}>
              Billed To
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-black)' }}>
              {invoice.client.companyName || invoice.client.name || 'Client Name'}
            </div>
            {invoice.client.name && invoice.client.companyName && (
              <div style={{ fontSize: '13px', color: 'var(--color-graphite)', marginTop: '2px' }}>
                Attn: {invoice.client.name}
              </div>
            )}
            <div style={{ fontSize: '12px', color: 'var(--color-gray)', marginTop: '4px', maxWidth: '280px', lineHeight: '1.4' }}>
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
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-soft-gray)', fontWeight: 600, marginBottom: '6px' }}>
                Project Reference
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-black)' }}>
                {invoice.client.projectName}
              </div>
            </div>
          )}
        </div>

        {/* Items Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '28px', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--color-black)', textAlign: 'left' }}>
              <th style={{ padding: '8px 0', fontWeight: 600, color: 'var(--color-black)', width: '45%' }}>Service & Description</th>
              <th style={{ padding: '8px 8px', fontWeight: 600, color: 'var(--color-black)', textAlign: 'center', width: '10%' }}>Qty</th>
              <th style={{ padding: '8px 8px', fontWeight: 600, color: 'var(--color-black)', textAlign: 'right', width: '15%' }}>Rate</th>
              <th style={{ padding: '8px 8px', fontWeight: 600, color: 'var(--color-black)', textAlign: 'center', width: '10%' }}>Tax</th>
              <th style={{ padding: '8px 0', fontWeight: 600, color: 'var(--color-black)', textAlign: 'right', width: '20%' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {(invoice.items || []).map((item, idx) => {
              const lineCalc = totals.lineCalculations.find((l) => l.id === item.id);
              const lineTotal = lineCalc ? lineCalc.total : item.quantity * item.rate * (1 + (item.taxPercent || 18) / 100);

              return (
                <tr key={item.id || idx} style={{ borderBottom: '1px solid var(--color-light-gray)' }}>
                  <td style={{ padding: '12px 0', verticalAlign: 'top' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-black)' }}>{item.name}</div>
                    {item.description && (
                      <div style={{ fontSize: '12px', color: 'var(--color-gray)', marginTop: '2px', lineHeight: '1.4' }}>
                        {item.description}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', color: 'var(--color-graphite)', verticalAlign: 'top' }}>
                    {item.quantity}
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'right', color: 'var(--color-graphite)', verticalAlign: 'top' }}>
                    {formatCurrency(item.rate, currency)}
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', color: 'var(--color-gray)', verticalAlign: 'top', fontSize: '12px' }}>
                    {item.taxPercent || 0}%
                  </td>
                  <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 600, color: 'var(--color-black)', verticalAlign: 'top' }}>
                    {formatCurrency(lineTotal, currency)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Totals Summary */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-soft-gray)', fontWeight: 600 }}>
              Scan to Pay
            </div>
            <img 
              src="/qr-code.jpeg" 
              alt="Payment QR Code" 
              onClick={() => setIsQrExpanded(true)}
              style={{ width: '120px', height: '120px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--color-light-gray)', cursor: 'zoom-in', transition: 'transform 0.2s ease', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
          </div>
          <div style={{ width: '260px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', color: 'var(--color-gray)' }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: 500, color: 'var(--color-black)' }}>{formatCurrency(totals.subtotal, currency)}</span>
            </div>

            {totals.itemDiscounts > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', color: 'var(--color-graphite)' }}>
                <span>Discount</span>
                <span style={{ fontWeight: 500 }}>-{formatCurrency(totals.itemDiscounts, currency)}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', color: 'var(--color-gray)' }}>
              <span>GST ({totals.effectiveTaxRate.toFixed(0)}%)</span>
              <span style={{ fontWeight: 500, color: 'var(--color-black)' }}>{formatCurrency(totals.taxTotal, currency)}</span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                marginTop: '6px',
                borderTop: '1px solid var(--color-light-gray)',
                borderBottom: '2px solid var(--color-black)',
                fontSize: '16px',
                fontWeight: 700,
                color: 'var(--color-black)',
              }}
            >
              <span>Grand Total</span>
              <span>{formatCurrency(totals.grandTotal, currency)}</span>
            </div>

            {totals.advancePaid > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', color: 'var(--color-gray)' }}>
                <span>Advance Paid</span>
                <span style={{ fontWeight: 500, color: 'var(--color-black)' }}>-{formatCurrency(totals.advancePaid, currency)}</span>
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
                  color: 'var(--color-black)',
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
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-soft-gray)', fontWeight: 600, marginBottom: '8px' }}>
                Payment Schedule
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-graphite)' }}>
                {invoice.paymentSchedule.map((pm) => (
                  <div key={pm.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                    <span>
                      {pm.percentage}% {pm.description}
                    </span>
                    <span style={{ fontWeight: 600, color: 'var(--color-black)' }}>
                      {formatCurrency(totals.grandTotal * (pm.percentage / 100), currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {invoice.notes && (
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-soft-gray)', fontWeight: 600, marginBottom: '8px' }}>
                Notes
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-gray)', margin: 0, lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                {invoice.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Terms & Conditions & Signatory */}
      <div style={{ borderTop: '1px solid var(--color-light-gray)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
        <div style={{ maxWidth: '65%' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-soft-gray)', fontWeight: 600, marginBottom: '6px' }}>
            Terms & Conditions
          </div>
          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', color: 'var(--color-gray)', lineHeight: '1.4' }}>
            {(invoice.terms || []).map((term, i) => (
              <li key={i}>{term}</li>
            ))}
          </ul>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px' }}>


          <div style={{ textAlign: 'right' }}>
            <div style={{ width: '120px', borderBottom: '1px solid var(--color-light-gray)', marginBottom: '6px' }} />
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-black)' }}>Authorized Signatory</div>
            <div style={{ fontSize: '10px', color: 'var(--color-soft-gray)' }}>{invoice.company.name || 'Noir Labs'}</div>
          </div>
        </div>
      </div>
    </div>
      
      {/* Expanded QR Code Modal */}
      {isQrExpanded && (
        <div 
          onClick={() => setIsQrExpanded(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'zoom-out'
          }}
        >
          <div style={{ 
            padding: '24px', 
            backgroundColor: 'var(--color-off-white)', 
            borderRadius: '24px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.4)'
          }}>
            <div style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-graphite)', fontWeight: 700, marginBottom: '16px', textAlign: 'center' }}>
              Scan to Pay
            </div>
            <img src="/qr-code.jpeg" alt="Payment QR Code" style={{ width: '300px', height: '300px', borderRadius: '12px', objectFit: 'cover' }} />
          </div>
        </div>
      )}
    </>
  );
});
