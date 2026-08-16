import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import html2pdf from 'html2pdf.js';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Save,
  Printer,
  Download,
  Eye,
  CheckCircle2,
  Sparkles,
  Layers,
  X,
  Plus,
} from 'lucide-react';
import { Invoice, Client, CatalogService } from '../types';
import { InvoiceBuilder } from './InvoiceBuilder';
import { InvoicePreview } from './InvoicePreview';
import { calculateInvoice } from '../lib/calc';
import { formatCurrency } from '../lib/utils';
import { useToast } from './Toast';

interface EditorProps {
  invoice: Invoice;
  clients: Client[];
  services: CatalogService[];
  onUpdate: (updates: Partial<Invoice>) => void;
  onSave: (inv?: Invoice) => void;
  onClose: () => void;
  onAddClient: (client: Omit<Client, 'id' | 'createdAt'>) => Client;
}

export function Editor({
  invoice,
  clients,
  services,
  onUpdate,
  onSave,
  onClose,
  onAddClient,
}: EditorProps) {
  const componentRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showNewClientModal, setShowNewClientModal] = useState(false);

  // New client form state
  const [newClientName, setNewClientName] = useState('');
  const [newClientCompany, setNewClientCompany] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientAddress, setNewClientAddress] = useState('');

  const totals = calculateInvoice(invoice);
  const currency = invoice.currency || 'INR';

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Invoice_${invoice.invoiceNumber}`,
  });

  const handleDownloadPDF = () => {
    if (!componentRef.current) return;

    const element = componentRef.current;
    const opt = {
      margin: 0,
      filename: `Invoice_${invoice.invoiceNumber}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        showToast(`Invoice ${invoice.invoiceNumber} PDF downloaded`);
      })
      .catch((err: any) => {
        console.error('PDF error', err);
        showToast('Failed to export PDF', 'error');
      });
  };

  const handleGenerateInvoice = () => {
    setIsGenerating(true);
    setTimeout(() => {
      onSave({ ...invoice, status: 'pending' });
      setIsGenerating(false);
      showToast('Invoice generated successfully', 'success');
    }, 600);
  };

  const handleSaveDraft = () => {
    onSave();
    showToast('Invoice draft saved', 'info');
  };

  const handleCreateClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() && !newClientCompany.trim()) return;

    const created = onAddClient({
      name: newClientName.trim() || newClientCompany.trim(),
      companyName: newClientCompany.trim(),
      email: newClientEmail.trim(),
      phone: newClientPhone.trim(),
      address: newClientAddress.trim(),
    });

    onUpdate({
      clientId: created.id,
      client: {
        ...invoice.client,
        name: created.name,
        companyName: created.companyName,
        email: created.email,
        phone: created.phone,
        address: created.address,
      },
    });

    // Reset
    setNewClientName('');
    setNewClientCompany('');
    setNewClientEmail('');
    setNewClientPhone('');
    setNewClientAddress('');
    setShowNewClientModal(false);
    showToast(`Client ${created.companyName || created.name} added!`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#0B0918] text-[#FFFFFF] flex flex-col font-sans">
      {/* Editor Top Bar */}
      <header className="sticky top-0 z-30 bg-[#0B0918]/85 backdrop-blur-xl border-b border-white/10 h-16 flex items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-5 w-px bg-white/10 hidden sm:block" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-bold text-sm sm:text-base text-white">
                {invoice.invoiceNumber || 'New Invoice'}
              </h1>
              <span
                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                  invoice.status === 'paid'
                    ? 'bg-teal-500/15 text-[#2DD4BF] border-teal-500/30'
                    : invoice.status === 'pending'
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    : invoice.status === 'overdue'
                    ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                    : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                }`}
              >
                {invoice.status}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons in Header */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-xs font-medium text-zinc-200 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-xs font-medium text-zinc-200 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#2DD4BF]" />
            <span className="hidden md:inline">Live Preview</span>
          </button>

          <button
            type="button"
            onClick={() => handlePrint()}
            className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-xs font-medium text-zinc-200 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.08] border border-white/15 hover:bg-white/[0.12] text-xs font-medium text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#A855F7]" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Builder (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <InvoiceBuilder
              invoice={invoice}
              onUpdate={onUpdate}
              clients={clients}
              services={services}
              onAddNewClient={() => setShowNewClientModal(true)}
            />
          </div>

          {/* Right Column: Prominent Live Summary (4 Cols, Sticky) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-5">
            {/* Live Summary Card */}
            <div className="glass-panel p-6 rounded-3xl border border-white/15 bg-gradient-to-b from-[#151027] to-[#100C22] shadow-2xl relative overflow-hidden">
              {/* Card Accent Glow */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#6D4AFF]/25 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#2DD4BF]/20 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="font-heading font-bold text-sm tracking-wider uppercase text-zinc-300">
                  Invoice Summary
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/[0.06] text-[#2DD4BF]">
                  {invoice.items?.length || 0} items
                </span>
              </div>

              {/* Summary Rows */}
              <div className="py-4 space-y-3 text-sm">
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-zinc-200">
                    {formatCurrency(totals.subtotal, currency)}
                  </span>
                </div>

                {totals.itemDiscounts > 0 && (
                  <div className="flex items-center justify-between text-rose-400">
                    <span>Discount</span>
                    <span className="font-mono">
                      -{formatCurrency(totals.itemDiscounts, currency)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-zinc-400">
                  <span>GST ({totals.effectiveTaxRate.toFixed(0)}%)</span>
                  <span className="font-mono text-zinc-200">
                    {formatCurrency(totals.taxTotal, currency)}
                  </span>
                </div>

                {/* Grand Total */}
                <div className="pt-4 mt-2 border-t border-white/10 flex items-baseline justify-between">
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      Grand Total
                    </span>
                    {totals.advancePaid > 0 && (
                      <span className="text-[11px] text-zinc-400">
                        Advance: {formatCurrency(totals.advancePaid, currency)}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <motion.span
                      key={totals.grandTotal}
                      initial={{ scale: 0.95, opacity: 0.8 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="font-heading font-extrabold text-2xl sm:text-3xl bg-gradient-to-r from-white via-purple-100 to-[#2DD4BF] bg-clip-text text-transparent"
                    >
                      {formatCurrency(totals.grandTotal, currency)}
                    </motion.span>
                  </div>
                </div>

                {totals.advancePaid > 0 && (
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Balance Due</span>
                    <span className="font-mono font-bold text-[#2DD4BF]">
                      {formatCurrency(totals.balanceDue, currency)}
                    </span>
                  </div>
                )}
              </div>

              {/* Primary Action Buttons */}
              <div className="pt-4 space-y-2.5">
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={handleGenerateInvoice}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#6D4AFF] via-[#8B5CF6] to-[#2DD4BF] text-white font-heading font-bold text-sm tracking-wide shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 glow-btn disabled:opacity-75 cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Generating Invoice...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-white" />
                      <span>Generate Invoice</span>
                    </>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="py-2.5 px-3 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
                  >
                    Save Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPreviewModal(true)}
                    className="py-2.5 px-3 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-xs font-semibold text-[#2DD4BF] hover:bg-[#2DD4BF]/10 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Preview Thumbnail Card */}
            <div
              onClick={() => setShowPreviewModal(true)}
              className="glass-panel p-4 rounded-2xl border border-white/10 cursor-pointer hover:border-purple-500/40 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#A855F7]" /> Document Canvas
                </span>
                <span className="text-[10px] text-zinc-400 group-hover:text-white transition-colors">
                  Click to Expand &rarr;
                </span>
              </div>
              <div className="bg-white rounded-lg p-2 shadow-inner overflow-hidden max-h-32 opacity-90 group-hover:opacity-100 transition-opacity">
                <div className="scale-[0.25] origin-top-left w-[400%] pointer-events-none text-slate-800">
                  <div className="font-bold text-lg">{invoice.company.name}</div>
                  <div className="text-xs text-gray-500">Invoice: {invoice.invoiceNumber}</div>
                  <div className="mt-2 text-xs font-semibold">Total: {formatCurrency(totals.grandTotal, currency)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Document DOM Container for PDF Export & Print */}
      <div className="hidden">
        <InvoicePreview ref={componentRef} invoice={invoice} />
      </div>

      {/* Live Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#151027] border border-white/15 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto"
            >
              {/* Modal Header */}
              <div className="p-4 sm:px-6 bg-[#100C22] border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-[#A855F7] flex items-center justify-center">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-white">Invoice Document Preview</h3>
                    <p className="text-xs text-zinc-400">High-resolution print and PDF output</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePrint()}
                    className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                    title="Print"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#6D4AFF] to-[#8B5CF6] text-white text-xs font-semibold"
                  >
                    <Download className="w-3.5 h-3.5" /> Download PDF
                  </button>
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors ml-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Preview Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#0B0918]/60 flex justify-center items-start">
                <div className="bg-white rounded-lg shadow-2xl overflow-hidden max-w-[210mm] w-full transform origin-top scale-95 sm:scale-100">
                  <InvoicePreview invoice={invoice} />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add New Client Modal */}
      <AnimatePresence>
        {showNewClientModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel bg-[#151027] border border-white/15 rounded-3xl max-w-md w-full p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <h3 className="font-heading font-bold text-base text-white">Add New Client</h3>
                <button
                  onClick={() => setShowNewClientModal(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateClientSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Corp"
                    value={newClientCompany}
                    onChange={(e) => setNewClientCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl dark-input"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Contact Person Name</label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl dark-input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Email</label>
                    <input
                      type="email"
                      placeholder="john@acme.com"
                      value={newClientEmail}
                      onChange={(e) => setNewClientEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl dark-input"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Phone</label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={newClientPhone}
                      onChange={(e) => setNewClientPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl dark-input"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Address</label>
                  <textarea
                    rows={2}
                    placeholder="Street, City, State, ZIP"
                    value={newClientAddress}
                    onChange={(e) => setNewClientAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl dark-input"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewClientModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/[0.04] text-zinc-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6D4AFF] to-[#8B5CF6] text-white font-semibold shadow-md"
                  >
                    Save & Select Client
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
