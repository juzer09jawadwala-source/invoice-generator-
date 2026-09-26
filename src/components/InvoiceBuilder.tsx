import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  Percent,
  Sparkles,
  UserPlus,
  ChevronDown,
  Building2,
  Clock,
  Check,
  AlertTriangle,
  Info,
  X,
  Search,
} from 'lucide-react';
import { Invoice, LineItem, Client, CatalogService, CurrencyCode, InvoiceStatus } from '../types';
import { formatCurrency, CURRENCY_SYMBOLS } from '../lib/utils';
import { calculateInvoice } from '../lib/calc';

interface Props {
  invoice: Invoice;
  onUpdate: (updates: Partial<Invoice>) => void;
  clients: Client[];
  services: CatalogService[];
  onAddNewClient: () => void;
}

export function InvoiceBuilder({
  invoice,
  onUpdate,
  clients,
  services,
  onAddNewClient,
}: Props) {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [catalogSearchQuery, setCatalogSearchQuery] = useState('');
  const totals = calculateInvoice(invoice);
  const currencySymbol = CURRENCY_SYMBOLS[invoice.currency || 'INR'] || '₹';

  // Client Selection Handlers
  const handleClientSelect = (clientId: string) => {
    if (clientId === 'new') {
      onAddNewClient();
      return;
    }
    const found = clients.find((c) => c.id === clientId);
    if (found) {
      onUpdate({
        clientId: found.id,
        client: {
          ...invoice.client,
          name: found.name,
          companyName: found.companyName,
          email: found.email,
          phone: found.phone,
          address: found.address,
        },
      });
    } else {
      onUpdate({ clientId: null });
    }
  };

  // Line Item Handlers
  const handleAddItem = () => {
    // A new row starts empty. Defaulting it to a real service would silently
    // add that service's price to the invoice total the moment the user clicks
    // "Add Item", which is how a phantom line ends up on a sent invoice.
    const newItem: LineItem = {
      id: crypto.randomUUID(),
      serviceId: null,
      name: '',
      description: '',
      quantity: 1,
      rate: 0,
      discountPercent: 0,
      taxPercent: invoice.gstPercent ?? 18,
    };

    onUpdate({ items: [...(invoice.items || []), newItem] });
  };

  const handleUpdateItem = (id: string, updates: Partial<LineItem>) => {
    const updated = (invoice.items || []).map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    onUpdate({ items: updated });
  };

  const handleServiceDropdownSelect = (itemId: string, serviceId: string) => {
    const selectedSvc = services.find((s) => s.id === serviceId);
    if (selectedSvc) {
      handleUpdateItem(itemId, {
        serviceId: selectedSvc.id,
        name: selectedSvc.name,
        description: selectedSvc.description,
        rate: selectedSvc.price,
        taxPercent: selectedSvc.taxPercent,
      });
    } else if (serviceId === 'custom') {
      handleUpdateItem(itemId, {
        serviceId: null,
        name: 'Custom Service',
        description: '',
      });
    }
  };

  const handleDeleteItem = (id: string) => {
    const updated = (invoice.items || []).filter((item) => item.id !== id);
    onUpdate({ items: updated });
    setDeleteConfirmId(null);
  };

  // Payment Schedule Handlers (Immutable updates)
  const handleAddMilestone = () => {
    const newMilestone = {
      id: crypto.randomUUID(),
      percentage: 20,
      description: 'Milestone Delivery',
    };
    onUpdate({ paymentSchedule: [...(invoice.paymentSchedule || []), newMilestone] });
  };

  const handleUpdateMilestone = (id: string, field: 'percentage' | 'description', value: any) => {
    const updated = (invoice.paymentSchedule || []).map((m) =>
      m.id === id ? { ...m, [field]: value } : m
    );
    onUpdate({ paymentSchedule: updated });
  };

  const handleDeleteMilestone = (id: string) => {
    const updated = (invoice.paymentSchedule || []).filter((m) => m.id !== id);
    onUpdate({ paymentSchedule: updated });
  };

  const totalPercentage = (invoice.paymentSchedule || []).reduce((sum, m) => sum + (Number(m.percentage) || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. New Invoice Meta Card */}
      <section className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/10 relative overflow-hidden">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-[#A855F7] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-white">Invoice Details</h2>
              <p className="text-xs text-zinc-400">Set client info, dates, and invoice identifier</p>
            </div>
          </div>

          {/* Status Badge Selector */}
          <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/10">
            {(['draft', 'pending', 'paid', 'overdue'] as InvoiceStatus[]).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => onUpdate({ status: st })}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all ${
                  invoice.status === st
                    ? st === 'paid'
                      ? 'bg-teal-500/20 text-[#2DD4BF] border border-teal-500/30'
                      : st === 'pending'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : st === 'overdue'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-white/10 text-white border border-white/20'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Client Selection */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400 flex items-center justify-between">
              <span>Client</span>
              <button
                type="button"
                onClick={onAddNewClient}
                className="text-[#2DD4BF] hover:underline flex items-center gap-1 font-normal text-[11px]"
              >
                <UserPlus className="w-3 h-3" /> + Add New Client
              </button>
            </label>
            <div className="relative">
              <select
                value={invoice.clientId || ''}
                onChange={(e) => handleClientSelect(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl dark-input text-xs font-medium appearance-none cursor-pointer pr-9"
              >
                <option value="" className="bg-[#150E0C] text-zinc-300">
                  Select Existing Client...
                </option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#150E0C] text-white">
                    {c.companyName ? `${c.companyName} (${c.name})` : c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Project Reference */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400">
              Project Name / Reference
            </label>
            <input
              type="text"
              placeholder="e.g. Website Redesign & Brand Identity"
              value={invoice.client.projectName || ''}
              onChange={(e) =>
                onUpdate({
                  client: { ...invoice.client, projectName: e.target.value },
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl dark-input text-xs font-medium"
            />
          </div>

          {/* Invoice Number */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400">
              Invoice Number
            </label>
            <input
              type="text"
              value={invoice.invoiceNumber}
              onChange={(e) => onUpdate({ invoiceNumber: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl dark-input text-xs font-medium font-mono"
            />
          </div>

          {/* Dates (Issue and Due) */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400">
                Issue Date
              </label>
              <input
                type="date"
                value={invoice.invoiceDate}
                onChange={(e) => onUpdate({ invoiceDate: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl dark-input text-xs font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400">
                Due Date
              </label>
              <input
                type="date"
                value={invoice.dueDate}
                onChange={(e) => onUpdate({ dueDate: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl dark-input text-xs font-medium"
              />
            </div>
          </div>
        </div>

        {/* Detailed Client Contact Fields */}
        <div className="mt-4 pt-4 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] text-zinc-400 mb-1">Contact Name</label>
            <input
              type="text"
              placeholder="Primary Contact"
              value={invoice.client.name}
              onChange={(e) =>
                onUpdate({ client: { ...invoice.client, name: e.target.value } })
              }
              className="w-full px-3 py-1.5 rounded-lg dark-input text-xs"
            />
          </div>
          <div>
            <label className="block text-[10px] text-zinc-400 mb-1">Email</label>
            <input
              type="email"
              placeholder="billing@client.com"
              value={invoice.client.email}
              onChange={(e) =>
                onUpdate({ client: { ...invoice.client, email: e.target.value } })
              }
              className="w-full px-3 py-1.5 rounded-lg dark-input text-xs"
            />
          </div>
          <div>
            <label className="block text-[10px] text-zinc-400 mb-1">Address</label>
            <input
              type="text"
              placeholder="Client Address"
              value={invoice.client.address}
              onChange={(e) =>
                onUpdate({ client: { ...invoice.client, address: e.target.value } })
              }
              className="w-full px-3 py-1.5 rounded-lg dark-input text-xs"
            />
          </div>
        </div>
      </section>

      {/* 2. Services & Line Items Card */}
      <section className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/10 relative">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-heading font-bold text-base text-white">Invoice Items</h2>
            <p className="text-xs text-zinc-400">
              Select predefined services or customize rates, quantities, discounts, and taxes
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCatalogModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl glass-btn text-white text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>

        {/* Desktop Table View (>= 768px) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="pb-3 w-[26%]">Service</th>
                <th className="pb-3 w-[26%]">Description</th>
                <th className="pb-3 text-center w-[8%]">Qty</th>
                <th className="pb-3 text-right w-[14%]">Rate ({currencySymbol})</th>
                <th className="pb-3 text-center w-[9%]">Disc %</th>
                <th className="pb-3 text-center w-[8%]">Tax %</th>
                <th className="pb-3 text-right w-[14%]">Total</th>
                <th className="pb-3 text-center w-[5%]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              <AnimatePresence>
                {(invoice.items || []).map((item) => {
                  const lineCalc = totals.lineCalculations.find((l) => l.id === item.id);
                  const isConfirming = deleteConfirmId === item.id;

                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Service Dropdown / Name */}
                      <td className="py-3 pr-2 align-top">
                        <div className="relative">
                          <select
                            value={item.serviceId || 'custom'}
                            onChange={(e) => handleServiceDropdownSelect(item.id, e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg dark-input text-xs font-medium appearance-none pr-6 truncate"
                          >
                            <option value="custom" className="bg-[#150E0C] text-amber-300 font-semibold">
                              + Custom Service / Other
                            </option>
                            {services.map((s) => (
                              <option key={s.id} value={s.id} className="bg-[#150E0C] text-white">
                                {s.name} ({formatCurrency(s.price, invoice.currency)})
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        {(!item.serviceId || item.serviceId === 'custom' || item.name === 'Custom Service') && (
                          <input
                            type="text"
                            placeholder="Custom service title"
                            value={item.name}
                            onChange={(e) => handleUpdateItem(item.id, { name: e.target.value })}
                            className="mt-1.5 w-full px-2.5 py-1 rounded-lg dark-input text-xs"
                          />
                        )}
                      </td>

                      {/* Description */}
                      <td className="py-3 pr-2 align-top">
                        <textarea
                          rows={2}
                          placeholder="Deliverable details..."
                          value={item.description}
                          onChange={(e) => handleUpdateItem(item.id, { description: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg dark-input text-xs resize-none"
                        />
                      </td>

                      {/* Qty */}
                      <td className="py-3 px-1 align-top text-center">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateItem(item.id, { quantity: Math.max(1, Number(e.target.value)) })
                          }
                          className="w-14 px-2 py-1.5 rounded-lg dark-input text-xs text-center font-mono"
                        />
                      </td>

                      {/* Rate */}
                      <td className="py-3 px-1 align-top text-right">
                        <input
                          type="number"
                          min="0"
                          value={item.rate}
                          onChange={(e) =>
                            handleUpdateItem(item.id, { rate: Number(e.target.value) })
                          }
                          className="w-24 px-2 py-1.5 rounded-lg dark-input text-xs text-right font-mono"
                        />
                      </td>

                      {/* Discount % */}
                      <td className="py-3 px-1 align-top text-center">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.discountPercent}
                          onChange={(e) =>
                            handleUpdateItem(item.id, {
                              discountPercent: Math.min(100, Math.max(0, Number(e.target.value))),
                            })
                          }
                          className="w-14 px-1.5 py-1.5 rounded-lg dark-input text-xs text-center font-mono"
                        />
                      </td>

                      {/* Tax % */}
                      <td className="py-3 px-1 align-top text-center">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.taxPercent}
                          onChange={(e) =>
                            handleUpdateItem(item.id, {
                              taxPercent: Math.max(0, Number(e.target.value)),
                            })
                          }
                          className="w-14 px-1.5 py-1.5 rounded-lg dark-input text-xs text-center font-mono"
                        />
                      </td>

                      {/* Total */}
                      <td className="py-3 pl-2 align-top text-right font-mono font-semibold text-xs text-white pt-4">
                        {formatCurrency(lineCalc?.total || 0, invoice.currency)}
                      </td>

                      {/* Delete Action */}
                      <td className="py-3 pl-2 align-top text-center pt-3.5">
                        {isConfirming ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-1 rounded bg-rose-500 text-white text-[10px]"
                              title="Confirm delete"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="p-1 rounded bg-zinc-700 text-zinc-300 text-[10px]"
                              title="Cancel"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(item.id)}
                            className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-white/[0.06] transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Mobile Card List View (< 768px) */}
        <div className="md:hidden space-y-3">
          <AnimatePresence>
            {(invoice.items || []).map((item, idx) => {
              const lineCalc = totals.lineCalculations.find((l) => l.id === item.id);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                      Item #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-zinc-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-400 mb-1">Service</label>
                    <select
                      value={item.serviceId || 'custom'}
                      onChange={(e) => handleServiceDropdownSelect(item.id, e.target.value)}
                      className="w-full px-3 py-2 rounded-lg dark-input text-xs"
                    >
                      <option value="custom" className="bg-[#150E0C] text-amber-300">
                        Custom Service
                      </option>
                      {services.map((s) => (
                        <option key={s.id} value={s.id} className="bg-[#150E0C]">
                          {s.name} ({formatCurrency(s.price, invoice.currency)})
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Service Name"
                      value={item.name}
                      onChange={(e) => handleUpdateItem(item.id, { name: e.target.value })}
                      className="mt-2 w-full px-3 py-1.5 rounded-lg dark-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-400 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={item.description}
                      onChange={(e) => handleUpdateItem(item.id, { description: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg dark-input text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1">Qty</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(item.id, { quantity: Number(e.target.value) })}
                        className="w-full px-2 py-1.5 rounded-lg dark-input text-xs text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1">Rate</label>
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => handleUpdateItem(item.id, { rate: Number(e.target.value) })}
                        className="w-full px-2 py-1.5 rounded-lg dark-input text-xs text-right font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1">Tax %</label>
                      <input
                        type="number"
                        value={item.taxPercent}
                        onChange={(e) => handleUpdateItem(item.id, { taxPercent: Number(e.target.value) })}
                        className="w-full px-2 py-1.5 rounded-lg dark-input text-xs text-center"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Line Total:</span>
                    <span className="font-mono font-bold text-white">
                      {formatCurrency(lineCalc?.total || 0, invoice.currency)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Global Financial Modifiers (Invoice Discount & Advance Paid) */}
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-white block">Overall Discount</span>
              <span className="text-[11px] text-zinc-400">Pro-rata distributed across items</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-zinc-400 font-mono">{currencySymbol}</span>
              <input
                type="number"
                min="0"
                value={invoice.discount}
                onChange={(e) => onUpdate({ discount: Number(e.target.value) })}
                className="w-28 px-2.5 py-1.5 rounded-lg dark-input text-xs text-right font-mono"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-white block">Advance Paid</span>
              <span className="text-[11px] text-zinc-400">Deducted from balance due</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-zinc-400 font-mono">{currencySymbol}</span>
              <input
                type="number"
                min="0"
                value={invoice.advancePaid}
                onChange={(e) => onUpdate({ advancePaid: Number(e.target.value) })}
                className="w-28 px-2.5 py-1.5 rounded-lg dark-input text-xs text-right font-mono"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Payment Milestones Schedule */}
      <section className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-heading font-bold text-base text-white">Payment Milestones</h2>
            <p className="text-xs text-zinc-400">Break down settlement stages (e.g. 50% Advance, 50% on Handover)</p>
          </div>
          <button
            type="button"
            onClick={handleAddMilestone}
            className="flex items-center gap-1 text-xs text-[#2DD4BF] hover:underline font-semibold"
          >
            <Plus className="w-3.5 h-3.5" /> Add Milestone
          </button>
        </div>

        <div className="space-y-2.5">
          {(invoice.paymentSchedule || []).map((pm) => (
            <div key={pm.id} className="flex items-center gap-2.5">
              <div className="flex items-center gap-1 w-24 flex-shrink-0">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={pm.percentage}
                  onChange={(e) => handleUpdateMilestone(pm.id, 'percentage', Number(e.target.value))}
                  className="w-16 px-2 py-1.5 rounded-lg dark-input text-xs text-center font-mono"
                />
                <span className="text-xs text-zinc-400">%</span>
              </div>
              <input
                type="text"
                value={pm.description}
                onChange={(e) => handleUpdateMilestone(pm.id, 'description', e.target.value)}
                placeholder="Milestone description"
                className="flex-1 px-3 py-1.5 rounded-lg dark-input text-xs"
              />
              <button
                type="button"
                onClick={() => handleDeleteMilestone(pm.id)}
                className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {totalPercentage !== 100 && (
            <div className="flex items-center gap-2 text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-xl text-xs mt-2">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>
                Total milestones equal <strong>{totalPercentage}%</strong> (recommended to sum to 100%).
              </span>
            </div>
          )}
        </div>
      </section>

      {/* 4. Notes & Terms */}
      <section className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold text-white mb-1.5">Client Notes</label>
          <textarea
            rows={4}
            value={invoice.notes}
            onChange={(e) => onUpdate({ notes: e.target.value })}
            placeholder="Payment instructions, bank wire details, gratitude note..."
            className="w-full px-3 py-2 rounded-xl dark-input text-xs leading-relaxed"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-white mb-1.5">
            Terms & Conditions <span className="text-zinc-500 font-normal">(one per line)</span>
          </label>
          <textarea
            rows={4}
            value={(invoice.terms || []).join('\n')}
            onChange={(e) =>
              onUpdate({
                terms: e.target.value.split('\n').filter((t) => t.trim() !== ''),
              })
            }
            className="w-full px-3 py-2 rounded-xl dark-input text-xs leading-relaxed font-mono"
          />
        </div>
      </section>

      {/* 5. Catalog Modal */}
      <AnimatePresence>
        {showCatalogModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel bg-[#150E0C] border border-white/15 rounded-3xl max-w-2xl w-full p-6 shadow-2xl max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div>
                  <h3 className="font-heading font-bold text-base text-white">Service Catalog</h3>
                  <p className="text-xs text-zinc-400">Select services to add to this invoice</p>
                </div>
                <button
                  onClick={() => setShowCatalogModal(false)}
                  className="text-zinc-400 hover:text-white p-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4 relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={catalogSearchQuery}
                  onChange={(e) => setCatalogSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl dark-input text-xs font-medium"
                />
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                {services
                  .filter((s) =>
                    s.name.toLowerCase().includes(catalogSearchQuery.toLowerCase()) ||
                    s.category.toLowerCase().includes(catalogSearchQuery.toLowerCase())
                  )
                  .map((svc) => (
                  <div key={svc.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-purple-500/30 transition-colors">
                    <div>
                      <div className="font-semibold text-sm text-white">{svc.name}</div>
                      <div className="text-xs text-zinc-400">{svc.description}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-mono text-sm text-white">{formatCurrency(svc.price, invoice.currency)}</div>
                        <div className="text-[10px] text-zinc-500">{svc.category}</div>
                      </div>
                      <button
                        onClick={() => {
                          const newItem: LineItem = {
                            id: crypto.randomUUID(),
                            serviceId: svc.id,
                            name: svc.name,
                            description: svc.description,
                            quantity: 1,
                            rate: svc.price,
                            discountPercent: 0,
                            taxPercent: svc.taxPercent,
                          };
                          onUpdate({ items: [...(invoice.items || []), newItem] });
                        }}
                        className="p-2 rounded-lg bg-white/[0.05] hover:bg-[#2DD4BF]/20 text-[#2DD4BF] transition-colors"
                        title="Add to Invoice"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {services.filter((s) =>
                    s.name.toLowerCase().includes(catalogSearchQuery.toLowerCase()) ||
                    s.category.toLowerCase().includes(catalogSearchQuery.toLowerCase())
                  ).length === 0 && (
                  <div className="text-center py-8 text-zinc-400 text-xs">
                    No services found matching "{catalogSearchQuery}"
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-white/10 flex justify-between items-center">
                <button
                  onClick={() => {
                    handleAddItem();
                    setShowCatalogModal(false);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
                >
                  + Add Custom Blank Item
                </button>
                <button
                  onClick={() => setShowCatalogModal(false)}
                  className="px-6 py-2.5 rounded-xl glass-btn text-white text-xs font-semibold"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
