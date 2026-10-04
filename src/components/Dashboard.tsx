import React from 'react';
import { motion } from 'motion/react';
import {
  Plus,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  FileText,
  Edit2,
  Copy,
  Trash2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Invoice, CurrencyCode } from '../types';
import { calculateInvoice } from '../lib/calc';
import { formatCurrency } from '../lib/utils';
import { AppView } from './AppShell';
import Testimonial1 from '@/components/ui/testimonial-1';
import { Button } from '@/components/ui/button';
import { ArchivalDossierRack } from './ArchivalDossierRack';
import { InteractiveScrapbook } from './InteractiveScrapbook';
import { FeatureShowcase } from './FeatureShowcase';
import { StackedSection } from './StackedSection';

interface DashboardProps {
  invoices: Invoice[];
  currency: CurrencyCode;
  onCreateNew: () => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onNavigate: (view: AppView) => void;
}

export function Dashboard({
  invoices,
  currency,
  onCreateNew,
  onLoad,
  onDelete,
  onDuplicate,
  onNavigate,
}: DashboardProps) {
  const [rates, setRates] = React.useState<Record<string, number> | null>(null);

  React.useEffect(() => {
    fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency.toLowerCase()}.json`)
      .then(res => res.json())
      .then(data => setRates(data[currency.toLowerCase()]))
      .catch(err => console.error("Failed to load dashboard rates", err));
  }, [currency]);

  // Dynamically compute stats from real invoice records
  const invoiceTotalsList = invoices.map((inv) => ({
    inv,
    totals: calculateInvoice(inv),
  }));

  const getConvertedAmount = (amount: number, invCurrency: string) => {
    const from = (invCurrency || 'INR').toLowerCase();
    const to = currency.toLowerCase();
    if (from === to) return amount;
    if (rates && rates[from]) {
      return amount / rates[from];
    }
    return amount;
  };

  const totalRevenue = invoiceTotalsList
    .filter(({ inv }) => inv.status === 'paid')
    .reduce((sum, { inv, totals }) => sum + getConvertedAmount(totals.grandTotal, inv.currency || 'INR'), 0);

  const pendingRevenue = invoiceTotalsList
    .filter(({ inv }) => inv.status === 'pending')
    .reduce((sum, { inv, totals }) => sum + getConvertedAmount(totals.grandTotal, inv.currency || 'INR'), 0);

  const paidCount = invoices.filter((inv) => inv.status === 'paid').length;
  const totalCount = invoices.length;

  const recentInvoices = [...invoices]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  return (
    <div className="flex flex-col relative">
      <StackedSection index={0}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-12 w-full space-y-6 sm:space-y-10">
        {/* Hero Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] border border-[#F4E7C8]/15 text-xs font-semibold text-[#F4E7C8] mb-2 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#E85D3F]" />
            <span className="tracking-wide uppercase text-[10px]">Next-Generation Studio Invoicing</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-[#F4E7C8] leading-tight break-words">
            Create professional{' '}
            <span className="bg-gradient-to-r from-[#E85D3F] via-[#F3C352] to-[#F4E7C8] bg-clip-text text-transparent">
              invoices
            </span>{' '}
            in seconds.
          </h1>
          <p className="text-[#D8CBB7] text-xs sm:text-sm sm:text-base font-normal max-w-xl">
            Create, manage and send high-converting studio invoices with live math, multi-currency support, and instant PDF generation.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Button
            onClick={onCreateNew}
            size="lg"
            className="font-heading font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>New Invoice</span>
          </Button>
        </div>
      </div>

      {/* 4 Dynamic Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Stat 1: Total Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="glass-panel glass-panel-hover p-4 rounded-2xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D8CBB7]">Total Revenue</span>
            <div className="w-7 h-7 rounded-lg bg-[#E85D3F]/20 text-[#E85D3F] flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-heading font-black text-[#F4E7C8] mb-1.5">
            {formatCurrency(totalRevenue, currency)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#F3C352]">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span className="font-semibold">+18.4%</span>
            <span className="text-[#D8CBB7]/70 font-normal">from last cycle</span>
          </div>
        </motion.div>

        {/* Stat 2: Pending Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className="glass-panel glass-panel-hover p-4 rounded-2xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D8CBB7]">Pending</span>
            <div className="w-7 h-7 rounded-lg bg-[#F3C352]/20 text-[#F3C352] flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-heading font-black text-[#F4E7C8] mb-1.5">
            {formatCurrency(pendingRevenue, currency)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#F3C352]">
            <span className="font-bold">{invoices.filter((i) => i.status === 'pending').length}</span>
            <span className="text-[#D8CBB7]/70 font-normal">awaiting settlement</span>
          </div>
        </motion.div>

        {/* Stat 3: Settled Paid Invoices */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.15 }}
          className="glass-panel glass-panel-hover p-4 rounded-2xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D8CBB7]">Paid Invoices</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-heading font-black text-[#F4E7C8] mb-1.5">
            {paidCount} <span className="text-sm font-normal text-[#D8CBB7]/70">/ {totalCount}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-300">
            <span className="font-bold">
              {totalCount > 0 ? ((paidCount / totalCount) * 100).toFixed(0) : 0}%
            </span>
            <span className="text-[#D8CBB7]/70 font-normal">conversion rate</span>
          </div>
        </motion.div>

        {/* Stat 4: Total Invoices Created */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.2 }}
          className="glass-panel glass-panel-hover p-4 rounded-2xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D8CBB7]">Total Invoices</span>
            <div className="w-7 h-7 rounded-lg bg-white/10 text-[#F4E7C8] flex items-center justify-center">
              <FileText className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-heading font-black text-[#F4E7C8] mb-1.5">
            {totalCount}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#D8CBB7]">
            <span className="font-bold text-[#F4E7C8]">All Time</span>
            <span className="text-[#D8CBB7]/70 font-normal">in local database</span>
          </div>
        </motion.div>
      </div>
      </div>
      </StackedSection>

      {/* Section 2: Interactive Archival Dossiers & System Vault (in.jpg) - FULL WIDTH */}
      <StackedSection index={1}>
        <div className="w-full bg-black border-y border-[#F4E7C8]/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative pb-12">
        <ArchivalDossierRack
          invoices={invoices}
          currency={currency}
          onCreateNew={onCreateNew}
          onNavigate={onNavigate}
        />
        </div>
      </StackedSection>

      {/* Section 3: Interactive Multimedia Portfolio Scrapbook (fl.jpg) - FULL WIDTH */}
      <StackedSection index={2}>
        <div className="w-full bg-black">
          <InteractiveScrapbook />
        </div>
      </StackedSection>

      {/* Section 4: 4 New Feature Image Showcases - FULL WIDTH */}
      <StackedSection index={3}>
        <div className="w-full">
          <FeatureShowcase />
        </div>
      </StackedSection>

      <StackedSection index={4}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-6 sm:space-y-10">

        {/* Recent Invoices Card */}
      <div className="glass-panel rounded-2xl p-5 shadow-2xl border border-[#F4E7C8]/15">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-heading font-extrabold text-lg text-[#F4E7C8]">Recent Invoices</h2>
            <p className="text-xs text-[#D8CBB7]">Latest issued client invoices and payment status</p>
          </div>
          <button
            onClick={() => onNavigate('invoices')}
            className="text-xs font-bold text-[#E85D3F] hover:text-[#F3C352] transition-colors flex items-center gap-1"
          >
            <span>View All ({invoices.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentInvoices.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-[#F4E7C8]/15 text-[#D8CBB7] flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#F4E7C8]">No invoices yet</h3>
            <p className="text-xs text-[#D8CBB7] max-w-sm mx-auto">
              Create your first client invoice with custom services and live preview.
            </p>
            <Button
              onClick={onCreateNew}
              size="default"
              className="mt-2"
            >
              <Plus className="w-3.5 h-3.5" /> Create Invoice
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full text-left min-w-[620px]">
              <thead>
                <tr className="border-b border-[#F4E7C8]/15 text-[11px] font-bold text-[#D8CBB7] uppercase tracking-wider">
                  <th className="pb-3 px-3">Invoice No.</th>
                  <th className="pb-3 px-3">Client</th>
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Amount</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4E7C8]/10">
                {recentInvoices.map((inv) => {
                  const totals = calculateInvoice(inv);
                  const invCurrency = inv.currency || currency;

                  return (
                    <tr
                      key={inv.id}
                      className="group hover:bg-white/[0.03] transition-colors text-xs"
                    >
                      <td className="py-4 px-3 font-mono font-bold text-[#F4E7C8]">
                        <button
                          onClick={() => onLoad(inv.id)}
                          className="hover:text-[#E85D3F] transition-colors"
                          aria-label={`Open invoice ${inv.invoiceNumber}`}
                        >
                          {inv.invoiceNumber}
                        </button>
                      </td>
                      <td className="py-4 px-3">
                        <div className="font-bold text-[#F4E7C8]">
                          {inv.client.companyName || inv.client.name || 'Unnamed Client'}
                        </div>
                        {inv.client.projectName && (
                          <div className="text-[11px] text-[#D8CBB7] truncate max-w-[200px]">
                            {inv.client.projectName}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-3 text-[#D8CBB7]">
                        {inv.invoiceDate
                          ? new Date(inv.invoiceDate).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '-'}
                      </td>
                      <td className="py-4 px-3">
                        <span
                          className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${
                            inv.status === 'paid'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : inv.status === 'pending'
                              ? 'bg-[#F3C352]/15 text-[#F3C352] border-[#F3C352]/30'
                              : inv.status === 'overdue'
                              ? 'bg-red-500/15 text-red-300 border-red-500/30'
                              : 'bg-white/5 text-[#D8CBB7] border-white/10'
                          }`}
                        >
                          {inv.status || 'pending'}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-right font-mono font-bold text-[#F4E7C8]">
                        {formatCurrency(totals.grandTotal, invCurrency)}
                      </td>
                      <td className="py-4 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onLoad(inv.id)}
                            className="p-1.5 rounded-lg bg-white/[0.04] border border-[#F4E7C8]/15 hover:bg-white/10 text-[#D8CBB7] hover:text-[#F4E7C8] transition-colors"
                            title="Edit Invoice"
                            aria-label={`Edit invoice ${inv.invoiceNumber}`}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDuplicate(inv.id)}
                            className="p-1.5 rounded-lg bg-white/[0.04] border border-[#F4E7C8]/15 hover:bg-white/10 text-[#D8CBB7] hover:text-[#F4E7C8] transition-colors"
                            title="Duplicate"
                            aria-label={`Duplicate invoice ${inv.invoiceNumber}`}
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDelete(inv.id)}
                            className="p-1.5 rounded-lg bg-white/[0.04] border border-[#F4E7C8]/15 hover:bg-red-500/20 text-[#D8CBB7] hover:text-red-400 transition-colors"
                            title="Delete"
                            aria-label={`Delete invoice ${inv.invoiceNumber}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </div>
      </StackedSection>

      {/* Community Testimonial & Value Metric Section */}
      <StackedSection index={5} isLast={true}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
          <Testimonial1 />
        </div>
      </StackedSection>
    </div>
  );
}
