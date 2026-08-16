import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Briefcase,
  Edit2,
  Trash2,
  RotateCcw,
  X,
  Sparkles,
  Tag,
} from 'lucide-react';
import { CatalogService, CurrencyCode } from '../types';
import { formatCurrency } from '../lib/utils';
import { useToast } from './Toast';

interface ServicesViewProps {
  services: CatalogService[];
  currency: CurrencyCode;
  onAddService: (data: Omit<CatalogService, 'id'>) => CatalogService;
  onUpdateService: (id: string, updates: Partial<CatalogService>) => void;
  onDeleteService: (id: string) => void;
  onResetDefaults: () => void;
}

export function ServicesView({
  services,
  currency,
  onAddService,
  onUpdateService,
  onDeleteService,
  onResetDefaults,
}: ServicesViewProps) {
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<CatalogService | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Design');
  const [price, setPrice] = useState(5000);
  const [taxPercent, setTaxPercent] = useState(18);
  const [description, setDescription] = useState('');

  const openAddModal = () => {
    setEditingService(null);
    setName('');
    setCategory('Design');
    setPrice(5000);
    setTaxPercent(18);
    setDescription('');
    setModalOpen(true);
  };

  const openEditModal = (svc: CatalogService) => {
    setEditingService(svc);
    setName(svc.name);
    setCategory(svc.category);
    setPrice(svc.price);
    setTaxPercent(svc.taxPercent);
    setDescription(svc.description);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingService) {
      onUpdateService(editingService.id, {
        name: name.trim(),
        category: category.trim(),
        price: Number(price) || 0,
        taxPercent: Number(taxPercent) || 0,
        description: description.trim(),
      });
      showToast('Service updated successfully', 'success');
    } else {
      onAddService({
        name: name.trim(),
        category: category.trim(),
        price: Number(price) || 0,
        taxPercent: Number(taxPercent) || 0,
        description: description.trim(),
      });
      showToast('New service added to catalog', 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string, svcName: string) => {
    onDeleteService(id);
    showToast(`Service ${svcName} removed from catalog`, 'info');
  };

  const handleReset = () => {
    onResetDefaults();
    showToast('Service catalog reset to 20 default services', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">Services Catalog</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Configure preset services, default hourly/fixed rates, and standard tax percentages
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-xs font-semibold text-zinc-300 hover:text-white transition-all"
            title="Reset to 20 default studio services"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#2DD4BF]" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6D4AFF] to-[#8B5CF6] text-white text-xs font-semibold hover:shadow-lg hover:shadow-purple-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Service</span>
          </button>
        </div>
      </div>

      {/* Services Table Card */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider bg-white/[0.02]">
                <th className="py-3.5 px-4 w-[28%]">Service Name</th>
                <th className="py-3.5 px-4 w-[16%]">Category</th>
                <th className="py-3.5 px-4 w-[30%]">Default Description</th>
                <th className="py-3.5 px-4 text-right w-[14%]">Default Rate</th>
                <th className="py-3.5 px-4 text-center w-[8%]">Tax</th>
                <th className="py-3.5 px-4 text-right w-[10%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-xs">
              {services.map((svc) => (
                <tr key={svc.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-semibold text-white">
                    {svc.name}
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/10 text-[#A855F7] border border-purple-500/20 text-[11px] font-medium">
                      <Tag className="w-3 h-3" />
                      {svc.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-zinc-400 max-w-xs truncate">
                    {svc.description || '—'}
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-bold text-white">
                    {formatCurrency(svc.price, currency)}
                  </td>
                  <td className="py-4 px-4 text-center font-mono text-zinc-300">
                    {svc.taxPercent}%
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(svc)}
                        className="p-1.5 rounded-lg bg-white/[0.04] border border-white/10 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                        title="Edit Service"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(svc.id, svc.name)}
                        className="p-1.5 rounded-lg bg-white/[0.04] border border-white/10 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Service Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel bg-[#151027] border border-white/15 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-heading font-bold text-base text-white">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Service Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mobile App UI Design"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl dark-input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl dark-input"
                    >
                      <option value="Design" className="bg-[#151027]">Design</option>
                      <option value="Development" className="bg-[#151027]">Development</option>
                      <option value="Branding" className="bg-[#151027]">Branding</option>
                      <option value="Marketing" className="bg-[#151027]">Marketing</option>
                      <option value="Media" className="bg-[#151027]">Media</option>
                      <option value="Content" className="bg-[#151027]">Content</option>
                      <option value="Support" className="bg-[#151027]">Support</option>
                      <option value="Strategy" className="bg-[#151027]">Strategy</option>
                      <option value="Custom" className="bg-[#151027]">Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Default Rate</label>
                    <input
                      type="number"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl dark-input font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Tax %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl dark-input font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Standard Description</label>
                  <textarea
                    rows={2}
                    placeholder="Deliverable details for invoice rows..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl dark-input"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/[0.04] text-zinc-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6D4AFF] to-[#8B5CF6] text-white font-semibold shadow-md"
                  >
                    {editingService ? 'Save Changes' : 'Add to Catalog'}
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
