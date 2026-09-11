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
  // Dynamically compute stats from real invoice records
  const invoiceTotalsList = invoices.map((inv) => ({
    inv,
    totals: calculateInvoice(inv),
  }));

  const totalRevenue = invoiceTotalsList
    .filter(({ inv }) => inv.status === 'paid')
    .reduce((sum, { totals }) => sum + totals.grandTotal, 0);

  const pendingRevenue = invoiceTotalsList
    .filter(({ inv }) => inv.status === 'pending')
    .reduce((sum, { totals }) => sum + totals.grandTotal, 0);

  const paidCount = invoices.filter((inv) => inv.status === 'paid').length;
  const totalCount = invoices.length;

  const recentInvoices = [...invoices]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-[#2DD4BF] mb-2 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Studio Invoicing</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-white leading-tight">
            Create professional{' '}
            <span className="bg-gradient-to-r from-[#A855F7] via-[#8B5CF6] to-[#2DD4BF] bg-clip-text text-transparent">
              invoices
            </span>{' '}
            in seconds.
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base font-normal max-w-xl">
            Create, manage and send high-converting studio invoices with live math, multi-currency support, and instant PDF generation.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2.5 px-5 py-3 rounded-2xl glass-btn text-white font-heading font-bold text-sm tracking-wide cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Invoice</span>
          </button>
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
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Total Revenue</span>
            <div className="w-7 h-7 rounded-lg bg-teal-500/15 text-[#2DD4BF] flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-heading font-bold text-white mb-1.5">
            {formatCurrency(totalRevenue, currency)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#2DD4BF]">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span className="font-semibold">+18.4%</span>
            <span className="text-zinc-500 font-normal">from last cycle</span>
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
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Pending</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-300 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-heading font-bold text-white mb-1.5">
            {formatCurrency(pendingRevenue, currency)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-amber-300">
            <span className="font-semibold">{invoices.filter((i) => i.status === 'pending').length}</span>
            <span className="text-zinc-500 font-normal">awaiting settlement</span>
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
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Paid Invoices</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-[#A855F7] flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-heading font-bold text-white mb-1.5">
            {paidCount} <span className="text-sm font-normal text-zinc-500">/ {totalCount}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#A855F7]">
            <span className="font-semibold">
              {totalCount > 0 ? ((paidCount / totalCount) * 100).toFixed(0) : 0}%
            </span>
            <span className="text-zinc-500 font-normal">conversion rate</span>
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
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Total Invoices</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 text-[#22D3EE] flex items-center justify-center">
              <FileText className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-heading font-bold text-white mb-1.5">
            {totalCount}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#22D3EE]">
            <span className="font-semibold">All Time</span>
            <span className="text-zinc-500 font-normal">in local database</span>
          </div>
        </motion.div>
      </div>

      {/* Recent Invoices Card */}
      <div className="glass-panel rounded-2xl p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-heading font-bold text-lg text-white">Recent Invoices</h2>
            <p className="text-xs text-zinc-400">Latest issued client invoices and payment status</p>
          </div>
          <button
            onClick={() => onNavigate('invoices')}
            className="text-xs font-semibold text-[#2DD4BF] hover:underline flex items-center gap-1"
          >
            <span>View All ({invoices.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentInvoices.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 text-zinc-400 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-white">No invoices yet</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Create your first client invoice with custom services and live preview.
            </p>
            <button
              onClick={onCreateNew}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-btn text-white text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" /> Create Invoice
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  <th className="pb-3 px-3">Invoice No.</th>
                  <th className="pb-3 px-3">Client</th>
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Amount</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {recentInvoices.map((inv) => {
                  const totals = calculateInvoice(inv);
                  const invCurrency = inv.currency || currency;

                  return (
                    <tr
                      key={inv.id}
                      className="group hover:bg-white/[0.02] transition-colors text-xs"
                    >
                      <td className="py-4 px-3 font-mono font-semibold text-white">
                        <button
                          onClick={() => onLoad(inv.id)}
                          className="hover:text-[#2DD4BF] transition-colors"
                        >
                          {inv.invoiceNumber}
                        </button>
                      </td>
                      <td className="py-4 px-3">
                        <div className="font-semibold text-white">
                          {inv.client.companyName || inv.client.name || 'Unnamed Client'}
                        </div>
                        {inv.client.projectName && (
                          <div className="text-[11px] text-zinc-500 truncate max-w-[200px]">
                            {inv.client.projectName}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-3 text-zinc-400">
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
                              ? 'bg-teal-500/15 text-[#2DD4BF] border-teal-500/30'
                              : inv.status === 'pending'
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                              : inv.status === 'overdue'
                              ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                              : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                          }`}
                        >
                          {inv.status || 'pending'}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-right font-mono font-bold text-white">
                        {formatCurrency(totals.grandTotal, invCurrency)}
                      </td>
                      <td className="py-4 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onLoad(inv.id)}
                            className="p-1.5 rounded-lg bg-white/[0.04] border border-white/10 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                            title="Edit Invoice"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDuplicate(inv.id)}
                            className="p-1.5 rounded-lg bg-white/[0.04] border border-white/10 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                            title="Duplicate"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDelete(inv.id)}
                            className="p-1.5 rounded-lg bg-white/[0.04] border border-white/10 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-colors"
                            title="Delete"
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
  );
}
