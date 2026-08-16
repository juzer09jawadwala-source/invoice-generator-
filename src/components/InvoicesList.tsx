import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Search,
  Filter,
  FileText,
  Edit2,
  Copy,
  Trash2,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { Invoice, InvoiceStatus, CurrencyCode } from '../types';
import { calculateInvoice } from '../lib/calc';
import { formatCurrency } from '../lib/utils';

interface InvoicesListProps {
  invoices: Invoice[];
  currency: CurrencyCode;
  onCreateNew: () => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export function InvoicesList({
  invoices,
  currency,
  onCreateNew,
  onLoad,
  onDelete,
  onDuplicate,
}: InvoicesListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | InvoiceStatus>('all');

  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesStatus;

    const matchesSearch =
      inv.invoiceNumber?.toLowerCase().includes(query) ||
      inv.client?.name?.toLowerCase().includes(query) ||
      inv.client?.companyName?.toLowerCase().includes(query) ||
      inv.client?.projectName?.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">Invoices</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage, filter, and track payment status across all issued client invoices
          </p>
        </div>

        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6D4AFF] to-[#8B5CF6] text-white text-xs font-semibold hover:shadow-lg hover:shadow-purple-600/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Invoice</span>
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search invoice number, client, project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl dark-input text-xs"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(['all', 'pending', 'paid', 'draft', 'overdue'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium uppercase tracking-wider transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-[#6D4AFF]/30 text-white border border-[#6D4AFF]/50 font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table Card */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        {filteredInvoices.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 text-zinc-400 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-white">No matching invoices found</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Try adjusting your search terms or filters, or create a new invoice.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider bg-white/[0.02]">
                  <th className="py-3.5 px-4">Invoice</th>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Issued Date</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-xs">
                {filteredInvoices.map((inv) => {
                  const totals = calculateInvoice(inv);
                  const invCurrency = inv.currency || currency;

                  return (
                    <tr
                      key={inv.id}
                      className="group hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="py-4 px-4 font-mono font-bold text-white">
                        <button
                          onClick={() => onLoad(inv.id)}
                          className="hover:text-[#2DD4BF] transition-colors"
                        >
                          {inv.invoiceNumber}
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-white">
                          {inv.client.companyName || inv.client.name || 'Unnamed Client'}
                        </div>
                        {inv.client.projectName && (
                          <div className="text-[11px] text-zinc-500 truncate max-w-[200px]">
                            {inv.client.projectName}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-zinc-400">
                        {inv.invoiceDate
                          ? new Date(inv.invoiceDate).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '-'}
                      </td>
                      <td className="py-4 px-4 text-zinc-400">
                        {inv.dueDate
                          ? new Date(inv.dueDate).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '-'}
                      </td>
                      <td className="py-4 px-4">
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
                      <td className="py-4 px-4 text-right font-mono font-bold text-white text-sm">
                        {formatCurrency(totals.grandTotal, invCurrency)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
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
