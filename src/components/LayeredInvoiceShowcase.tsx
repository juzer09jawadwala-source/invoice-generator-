import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Copy,
  Printer,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Globe,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  ExternalLink,
} from 'lucide-react';
import { Invoice, CurrencyCode } from '@/types';
import { calculateInvoice } from '@/lib/calc';
import { formatCurrency } from '@/lib/utils';

interface LayeredInvoiceShowcaseProps {
  invoices: Invoice[];
  currency: CurrencyCode;
  selectedId?: string;
  onSelectId?: (id: string) => void;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete?: (id: string) => void;
  onCreateNew: () => void;
}

export function LayeredInvoiceShowcase({
  invoices,
  currency,
  selectedId,
  onSelectId,
  onEdit,
  onDuplicate,
  onCreateNew,
}: LayeredInvoiceShowcaseProps) {
  // Safe fallback if list is empty
  if (!invoices || invoices.length === 0) {
    return (
      <div className="w-full py-16 text-center rounded-3xl bg-black/60 border border-white/10 backdrop-blur-xl">
        <FileText className="w-12 h-12 text-off-white mx-auto mb-3 opacity-80" />
        <h3 className="text-xl font-heading font-bold text-off-white">No Invoices Available</h3>
        <p className="text-sm text-light-gray mt-1 mb-6">Create your first invoice to view the editorial showcase.</p>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-off-white hover:bg-light-gray text-white text-xs font-semibold shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create First Invoice</span>
        </button>
      </div>
    );
  }

  // Active invoice determination
  const activeIndex = Math.max(
    0,
    invoices.findIndex((inv) => inv.id === selectedId)
  );
  const activeInvoice = invoices[activeIndex] || invoices[0];
  const activeTotals = calculateInvoice(activeInvoice);
  const activeCurrency = activeInvoice.currency || currency;

  // Secondary invoice (the one peeking behind in the Pinterest composition)
  const secondaryIndex = (activeIndex + 1) % invoices.length;
  const secondaryInvoice = invoices.length > 1 ? invoices[secondaryIndex] : null;
  const secondaryTotals = secondaryInvoice ? calculateInvoice(secondaryInvoice) : null;
  const secondaryCurrency = secondaryInvoice ? secondaryInvoice.currency || currency : currency;

  // Tertiary invoice (optional extra subtle depth sheet if >= 3 invoices)
  const tertiaryIndex = (activeIndex + 2) % invoices.length;
  const tertiaryInvoice = invoices.length > 2 ? invoices[tertiaryIndex] : null;

  // Navigation handlers
  const handlePrev = () => {
    const nextIdx = (activeIndex - 1 + invoices.length) % invoices.length;
    onSelectId?.(invoices[nextIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % invoices.length;
    onSelectId?.(invoices[nextIdx].id);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="relative w-full py-4 lg:py-8">
      {/* Editorial Section Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] border border-white/10 text-xs font-medium text-off-white mb-2 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-off-white" />
            <span className="tracking-wide uppercase text-[10px] font-bold">Featured Editorial Showcase</span>
            <span className="text-light-gray/60">•</span>
            <span className="text-[11px] text-light-gray">
              {activeIndex + 1} of {invoices.length} invoices
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-off-white tracking-tight">
            Layered Document Composition
          </h2>
          <p className="text-xs sm:text-sm text-light-gray mt-0.5">
            Physical document presentation inspired by modern editorial studio publications.
          </p>
        </div>

        {/* Carousel & Action Controls */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Previous / Next Flip Controls */}
          <div className="flex items-center bg-black/70 backdrop-blur-md border border-white/10 rounded-2xl p-1 shadow-lg">
            <button
              onClick={handlePrev}
              disabled={invoices.length <= 1}
              className="p-2 rounded-xl text-off-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Previous invoice"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono text-xs font-semibold text-light-gray select-none">
              {activeIndex + 1}/{invoices.length}
            </span>
            <button
              onClick={handleNext}
              disabled={invoices.length <= 1}
              className="p-2 rounded-xl text-off-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Next invoice"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Edit Button */}
          <button
            onClick={() => onEdit(activeInvoice.id)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-black/80 hover:bg-black text-off-white border border-white/15 text-xs font-semibold shadow-lg hover:shadow-xl transition-all"
            title="Open Editor"
          >
            <Edit2 className="w-3.5 h-3.5 text-off-white" />
            <span className="hidden sm:inline">Edit</span>
          </button>

          {/* Duplicate Button */}
          <button
            onClick={() => onDuplicate(activeInvoice.id)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/[0.08] hover:bg-white/15 text-off-white border border-white/10 text-xs font-semibold shadow-lg transition-all"
            title="Duplicate Invoice"
          >
            <Copy className="w-3.5 h-3.5 text-light-gray" />
            <span className="hidden sm:inline">Duplicate</span>
          </button>

          {/* Create New Button */}
          <button
            onClick={onCreateNew}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-off-white hover:bg-light-gray text-white text-xs font-bold shadow-lg shadow-off-white/25 hover:shadow-xl transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
        </div>
      </div>

      {/* The Layered Invoices Composition Container */}
      <div className="relative w-full flex justify-center items-center py-4 sm:py-6 px-1 sm:px-4 lg:py-10 overflow-hidden sm:overflow-visible">
        <div className="relative w-full max-w-[650px] lg:max-w-[720px]">
          {/* ======================================================== */}
          {/* LAYER 3: TERTIARY DEEP BACKGROUND SHEET (If >= 3 items)  */}
          {/* ======================================================== */}
          {tertiaryInvoice && (
            <div
              aria-hidden="true"
              className="hidden lg:block absolute -top-4 -left-6 w-full h-[88%] rounded-[36px] bg-black/80 border border-white/[0.05] pointer-events-none -rotate-[4deg] shadow-2xl opacity-40 scale-[0.96] transition-transform"
            />
          )}

          {/* ======================================================== */}
          {/* LAYER 2: SECONDARY OFFSET CARD (Behind, peeking right)   */}
          {/* ======================================================== */}
          {secondaryInvoice && secondaryTotals && (
            <motion.div
              onClick={() => onSelectId?.(secondaryInvoice.id)}
              initial={false}
              animate={{
                x: 20,
                y: 34,
                rotate: 1.8,
                opacity: 0.85,
                scale: 0.98,
              }}
              whileHover={{
                x: 28,
                y: 28,
                rotate: 2.8,
                opacity: 0.95,
                scale: 0.99,
                cursor: 'pointer',
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 25 }}
              className="hidden md:block absolute inset-0 rounded-[32px] sm:rounded-[38px] overflow-hidden shadow-2xl z-10 border border-white/10 select-none bg-off-white"
              style={{
                boxShadow: '0 25px 50px -12px rgba(35, 8, 5, 0.65), 0 0 0 1px rgba(255,255,255,0.06)',
              }}
              title={`Click to view invoice ${secondaryInvoice.invoiceNumber}`}
            >
              {/* Secondary Card Header Banner */}
              <div className="bg-black p-6 pb-5 flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-black text-2xl tracking-tight text-off-white">
                    Invoice
                  </h3>
                  <p className="text-[10px] text-light-gray/80 uppercase tracking-wider font-medium">
                    {secondaryInvoice.company.name || 'Noir Labs'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full border border-white/20 bg-white/5 text-[10px] font-semibold text-light-gray">
                    {secondaryInvoice.invoiceNumber}
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-off-white">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Secondary Card Coral Strip */}
              <div className="bg-off-white px-6 py-4 flex items-center justify-between text-white">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-white/80">Invoice To</div>
                  <div className="font-heading font-bold text-sm text-white truncate max-w-[200px]">
                    {secondaryInvoice.client.companyName || secondaryInvoice.client.name || 'Client Name'}
                  </div>
                </div>
                <div className="px-3.5 py-1.5 rounded-full bg-soft-gray text-black font-mono font-black text-xs shadow-md">
                  {formatCurrency(secondaryTotals.grandTotal, secondaryCurrency)}
                </div>
              </div>

              {/* Secondary Card Cream Body (peeking content) */}
              <div className="p-6 bg-off-white space-y-3 opacity-75">
                <div className="bg-black rounded-xl px-4 py-2 flex justify-between text-[10px] font-bold text-white uppercase tracking-wider">
                  <span>Item Description</span>
                  <span>Amount</span>
                </div>
                {(secondaryInvoice.items || []).slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs text-black border-b border-light-gray pb-2 font-medium">
                    <span>{item.name}</span>
                    <span className="font-mono font-bold">
                      {formatCurrency(item.quantity * item.rate, secondaryCurrency)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* LAYER 1: PRIMARY FRONT INVOICE CARD (Centerpiece!)       */}
          {/* ======================================================== */}
          <motion.div
            key={activeInvoice.id}
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative z-20 w-full rounded-[28px] sm:rounded-[36px] overflow-hidden bg-off-white text-black transition-all"
            style={{
              boxShadow: `
                0 30px 60px -12px rgba(25, 4, 3, 0.75),
                0 18px 36px -18px rgba(0, 0, 0, 0.45),
                0 0 0 1px rgba(255, 255, 255, 0.12)
              `,
            }}
          >
            {/* 1. TOP HEADER SECTION (Obsidian Dark Surface var(--color-black)) */}
            <div className="bg-black text-white p-4 sm:p-6 lg:p-8 sm:pb-7 transition-colors">
              <div className="flex items-start justify-between gap-4">
                {/* Title & Editorial Tagline */}
                <div>
                  <h1 className="font-heading font-black text-2xl sm:text-4xl lg:text-5xl text-off-white tracking-tight leading-none">
                    Invoice
                  </h1>
                  <p className="text-[11px] sm:text-xs text-light-gray mt-2 font-medium max-w-sm tracking-wide">
                    Elevate Your Style, Embrace Your Uniqueness: Where Studio Craft Meets Precision Billing.
                  </p>
                </div>

                {/* Company Name Pill Badge + Interactive Arrow */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/20 bg-white/[0.06] backdrop-blur-md shadow-inner">
                    <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase text-off-white">
                      {activeInvoice.company.name || 'NOIR LABS'}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-off-white" />
                  </div>

                  {/* Quick Carousel Arrow Button (matching circular arrow button in Pinterest reference) */}
                  <button
                    onClick={handleNext}
                    className="w-8 h-8 rounded-full bg-white/[0.08] border border-white/15 flex items-center justify-center text-off-white hover:bg-off-white hover:text-white transition-all cursor-pointer"
                    title="Next invoice"
                    aria-label="Next invoice"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* 2. CLIENT & METADATA BANNER (Warm Terracotta / Coral var(--color-off-white)) */}
            <div className="bg-off-white text-white px-4 sm:px-6 lg:px-8 py-4 sm:py-6 relative overflow-hidden">
              {/* Subtle decorative inner corner curve matching reference */}
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                {/* Left: Invoice To & Client Name */}
                <div className="space-y-1 max-w-md">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-white/80">
                    Invoice To
                  </div>
                  <h3 className="font-heading font-extrabold text-lg sm:text-2xl text-white tracking-tight leading-snug">
                    {activeInvoice.client.companyName || activeInvoice.client.name || 'Client Name'}
                  </h3>
                  {activeInvoice.client.name && activeInvoice.client.companyName && (
                    <p className="text-xs text-white/90 font-medium">Attn: {activeInvoice.client.name}</p>
                  )}
                  {activeInvoice.client.address && (
                    <p className="text-[11px] text-white/80 line-clamp-1 leading-relaxed">
                      {activeInvoice.client.address}
                    </p>
                  )}

                  {/* Quick Client Contact Pills */}
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-white/85">
                    {activeInvoice.client.phone && (
                      <span className="inline-flex items-center gap-1">
                        <Phone className="w-3 h-3 text-soft-gray" />
                        <span>{activeInvoice.client.phone}</span>
                      </span>
                    )}
                    {activeInvoice.client.email && (
                      <span className="inline-flex items-center gap-1">
                        <Mail className="w-3 h-3 text-soft-gray" />
                        <span className="truncate max-w-[170px]">{activeInvoice.client.email}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Invoice No, Date, and Distinctive Golden Amount Pill */}
                <div className="flex flex-col md:items-end justify-between gap-2.5">
                  <div className="text-left md:text-right space-y-0.5">
                    <div className="text-xs text-white/90">
                      <span className="text-white/70 font-medium">No. Invoice: </span>
                      <strong className="font-mono font-bold">{activeInvoice.invoiceNumber}</strong>
                    </div>
                    <div className="text-xs text-white/90">
                      <span className="text-white/70 font-medium">Date: </span>
                      <span>{formatDate(activeInvoice.invoiceDate)}</span>
                    </div>
                    {activeInvoice.dueDate && (
                      <div className="text-[11px] text-white/75">
                        <span className="text-white/60">Due: </span>
                        <span>{formatDate(activeInvoice.dueDate)}</span>
                      </div>
                    )}
                  </div>

                  {/* Distinctive Yellow/Amber Pill from Reference */}
                  <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-soft-gray text-black shadow-lg shadow-black/15 self-start md:self-auto">
                    <span className="text-[11px] font-bold uppercase tracking-wider opacity-75">Total:</span>
                    <span className="font-mono font-black text-sm sm:text-lg tabular-nums">
                      {formatCurrency(activeTotals.grandTotal, activeCurrency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. ITEMS TABLE AREA (Warm Editorial Cream Surface var(--color-off-white)) */}
            <div className="p-4 sm:p-6 lg:p-8 bg-off-white">
              {/* Dark Rounded Pill Header for Columns (Exact Pinterest reference feature) */}
              <div className="bg-black text-off-white rounded-xl sm:rounded-2xl px-3 sm:px-6 py-2.5 mb-4 grid grid-cols-12 text-[10px] sm:text-xs font-bold uppercase tracking-wider items-center shadow-md">
                <span className="col-span-5 sm:col-span-5">Item Description</span>
                <span className="col-span-3 sm:col-span-2 text-right">Price</span>
                <span className="col-span-1 sm:col-span-2 text-center">Qty</span>
                <span className="col-span-3 sm:col-span-3 text-right">Amount</span>
              </div>

              {/* Items List Rows */}
              <div className="divide-y divide-light-gray space-y-1">
                {(activeInvoice.items && activeInvoice.items.length > 0
                  ? activeInvoice.items
                  : [
                      {
                        id: 'dummy-1',
                        name: 'Professional Creative Deliverable',
                        description: 'Deliverables tailored per studio agreement',
                        quantity: 1,
                        rate: 12000,
                      },
                    ]
                ).map((item, idx) => {
                  const lineTotal = item.quantity * item.rate;
                  return (
                    <div
                      key={item.id || idx}
                      className="grid grid-cols-12 items-start py-2.5 sm:py-3 px-1.5 sm:px-3 text-[11px] sm:text-sm font-medium hover:bg-light-gray/50 rounded-xl transition-colors"
                    >
                      <div className="col-span-5 sm:col-span-5 pr-1 sm:pr-2">
                        <div className="font-heading font-bold text-black truncate">{item.name}</div>
                        {item.description && (
                          <div className="text-[10px] sm:text-[11px] text-gray line-clamp-1 mt-0.5 font-normal">
                            {item.description}
                          </div>
                        )}
                      </div>
                      <div className="col-span-3 sm:col-span-2 text-right font-mono text-deep-graphite pt-0.5 text-[10px] sm:text-xs">
                        {formatCurrency(item.rate, activeCurrency)}
                      </div>
                      <div className="col-span-1 sm:col-span-2 text-center font-mono text-deep-graphite pt-0.5 text-[10px] sm:text-xs">
                        {item.quantity}
                      </div>
                      <div className="col-span-3 sm:col-span-3 text-right font-mono font-bold text-black pt-0.5 text-[11px] sm:text-xs">
                        {formatCurrency(lineTotal, activeCurrency)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Editorial Divider: Asterisks ✦ ✦ ✦ & Subtotal Pill */}
              <div className="flex items-center justify-between pt-5 pb-3 border-t border-light-gray mt-3">
                {/* Asterisk / Starburst Motif from Pinterest Reference */}
                <div className="flex items-center gap-2 text-sm text-black tracking-widest font-black select-none opacity-80">
                  <span>✦</span>
                  <span>✦</span>
                  <span>✦</span>
                </div>

                {/* Sub Total Rounded Pill */}
                <div className="px-4 py-1.5 rounded-full border border-black/30 bg-light-gray text-black text-xs font-mono font-bold flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray">
                    Sub Total:
                  </span>
                  <span>{formatCurrency(activeTotals.subtotal, activeCurrency)}</span>
                </div>
              </div>

              {/* 4. BOTTOM 3 MODULAR CLUSTERS (Matching Pinterest reference cards!) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-5">
                {/* Box 1: Terracotta Pill Container (TERM & CONDITIONS) */}
                <div className="rounded-2xl p-4 bg-off-white text-white shadow-md flex flex-col justify-between">
                  <div>
                    <h4 className="font-heading font-black text-xs uppercase tracking-wider text-white mb-2.5">
                      Term & Conditions
                    </h4>
                    <div className="space-y-1.5 text-[10px] text-white/90 leading-tight">
                      {(activeInvoice.terms && activeInvoice.terms.length > 0
                        ? activeInvoice.terms.slice(0, 3)
                        : [
                            'All prices subject to GST as applicable.',
                            'Advance payment is non-refundable.',
                            'Payment terms are Net 14 days.',
                          ]
                      ).map((term, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-soft-gray mt-1 flex-shrink-0" />
                          <span className="line-clamp-2">{term}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 text-[9px] uppercase tracking-wider text-white/70 font-semibold">
                    Status: <strong className="text-white uppercase">{activeInvoice.status}</strong>
                  </div>
                </div>

                {/* Box 2: Warm Gold / Amber Container (FIND US FOR MORE INFORMATION) */}
                <div className="rounded-2xl p-4 bg-soft-gray text-black shadow-md flex flex-col justify-between">
                  <div>
                    <h4 className="font-heading font-black text-xs uppercase tracking-wider text-black mb-2.5">
                      Find Us For More Information
                    </h4>
                    <div className="space-y-1.5 text-[10px] font-medium text-black">
                      {activeInvoice.company.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-black" />
                          <span>{activeInvoice.company.phone}</span>
                        </div>
                      )}
                      {activeInvoice.company.email && (
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-black" />
                          <span className="truncate">{activeInvoice.company.email}</span>
                        </div>
                      )}
                      {activeInvoice.company.website && (
                        <div className="flex items-center gap-1.5">
                          <Globe className="w-3 h-3 text-black" />
                          <span className="truncate">{activeInvoice.company.website}</span>
                        </div>
                      )}
                      {activeInvoice.company.address && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-black" />
                          <span className="truncate">{activeInvoice.company.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 text-[9px] text-black font-semibold uppercase tracking-wider">
                    Official Studio Invoice
                  </div>
                </div>

                {/* Box 3: Cream Container with Stylized Script Signature & Manager Badge */}
                <div className="rounded-2xl p-4 bg-light-gray border border-soft-gray shadow-md flex flex-col items-center justify-between text-center">
                  <div className="w-full flex justify-between items-center text-[9px] font-bold uppercase tracking-wider text-graphite">
                    <span>Signatory</span>
                    <span>Verified</span>
                  </div>

                  {/* Stylized Handwritten Script Signature */}
                  <div className="py-2">
                    <span
                      style={{ fontFamily: "'Caveat', 'Playwrite', 'Dancing Script', cursive" }}
                      className="text-3xl font-bold text-black tracking-wide inline-block transform -rotate-3"
                    >
                      {activeInvoice.company.name || 'Noir Labs'}
                    </span>
                    <div className="text-[11px] font-bold text-deep-graphite mt-0.5">
                      Juzer Jawadwala
                    </div>
                  </div>

                  {/* Yellow/Gold "MANAGER" / "AUTHORIZED" Pill from Reference */}
                  <div className="px-5 py-1 rounded-full bg-soft-gray text-black font-heading font-black text-[10px] tracking-wider uppercase shadow-sm">
                    Manager
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Quick Action Strip directly on document */}
            <div className="bg-black px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 flex flex-wrap items-center justify-between gap-2.5 text-xs border-t border-white/10">
              <div className="flex items-center gap-2 text-light-gray">
                <span className="w-2 h-2 rounded-full bg-off-white animate-pulse" />
                <span className="font-mono">{activeInvoice.invoiceNumber}</span>
                <span>•</span>
                <span className="font-semibold text-white truncate max-w-[140px] sm:max-w-none">
                  {activeInvoice.client.companyName || activeInvoice.client.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(activeInvoice.id)}
                  className="px-3 py-1.5 rounded-lg bg-off-white hover:bg-light-gray text-white text-xs font-semibold shadow transition-colors flex items-center gap-1.5 cursor-pointer"
                  aria-label="Open Full Editor for this invoice"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Open Full Editor</span>
                </button>
                <button
                  onClick={() => onDuplicate(activeInvoice.id)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-off-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                  aria-label="Duplicate this invoice"
                >
                  <Copy className="w-3 h-3" />
                  <span>Duplicate</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
