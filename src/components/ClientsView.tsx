import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Users,
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  DollarSign,
  Edit2,
  Trash2,
  X,
  Sparkles,
} from 'lucide-react';
import { Client, Invoice, CurrencyCode } from '../types';
import { calculateInvoice } from '../lib/calc';
import { formatCurrency } from '../lib/utils';
import { useToast } from './Toast';

interface ClientsViewProps {
  clients: Client[];
  invoices: Invoice[];
  currency: CurrencyCode;
  onAddClient: (data: Omit<Client, 'id' | 'createdAt'>) => Client;
  onUpdateClient: (id: string, updates: Partial<Client>) => void;
  onDeleteClient: (id: string) => void;
  onCreateInvoiceForClient: (clientId: string) => void;
}

export function ClientsView({
  clients,
  invoices,
  currency,
  onAddClient,
  onUpdateClient,
  onDeleteClient,
  onCreateInvoiceForClient,
}: ClientsViewProps) {
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const openAddModal = () => {
    setEditingClient(null);
    setName('');
    setCompanyName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setModalOpen(true);
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setName(client.name);
    setCompanyName(client.companyName);
    setEmail(client.email);
    setPhone(client.phone);
    setAddress(client.address);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() && !name.trim()) return;

    if (editingClient) {
      onUpdateClient(editingClient.id, {
        name: name.trim() || companyName.trim(),
        companyName: companyName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });
      showToast('Client details updated', 'success');
    } else {
      onAddClient({
        name: name.trim() || companyName.trim(),
        companyName: companyName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });
      showToast('New client added successfully', 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string, clientName: string) => {
    onDeleteClient(id);
    showToast(`Client ${clientName} removed`, 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">Clients</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Directory of corporate clients, billing addresses, and invoice histories
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6D4AFF] to-[#8B5CF6] text-white text-xs font-semibold hover:shadow-lg hover:shadow-purple-600/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Client</span>
        </button>
      </div>

      {/* Clients Card Grid */}
      {clients.length === 0 ? (
        <div className="glass-panel p-16 rounded-3xl border border-white/10 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] text-zinc-400 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-white">No clients found</h3>
          <p className="text-xs text-zinc-400">Add your first client to quickly prefill invoices.</p>
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6D4AFF] to-[#8B5CF6] text-white text-xs font-semibold"
          >
            Add Client
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {clients.map((client) => {
            // Find invoices for this client
            const clientInvoices = invoices.filter(
              (inv) => inv.clientId === client.id || inv.client.companyName === client.companyName
            );

            const totalBilled = clientInvoices.reduce((sum, inv) => {
              const t = calculateInvoice(inv);
              return sum + t.grandTotal;
            }, 0);

            return (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel glass-panel-hover p-6 rounded-3xl border border-white/10 flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top Bar: Company Name & Actions */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6D4AFF]/30 to-[#2DD4BF]/30 border border-white/10 flex items-center justify-center font-heading font-bold text-white text-sm">
                        {(client.companyName || client.name).substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-base text-white">
                          {client.companyName || client.name}
                        </h3>
                        {client.companyName && client.name && (
                          <p className="text-xs text-zinc-400">Attn: {client.name}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(client)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                        title="Edit Client"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(client.id, client.companyName || client.name)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/15 transition-colors"
                        title="Delete Client"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Contact Info List */}
                  <div className="space-y-2 text-xs text-zinc-300 py-2 border-t border-b border-white/[0.06]">
                    {client.email && (
                      <div className="flex items-center gap-2 text-zinc-400">
                        <Mail className="w-3.5 h-3.5 text-[#2DD4BF]" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center gap-2 text-zinc-400">
                        <Phone className="w-3.5 h-3.5 text-[#A855F7]" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                    {client.address && (
                      <div className="flex items-start gap-2 text-zinc-400">
                        <MapPin className="w-3.5 h-3.5 text-[#6D4AFF] flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{client.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer: Stats & Create Invoice CTA */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-zinc-400">{clientInvoices.length} Invoices</span>
                    <span className="font-mono font-bold text-white">
                      {formatCurrency(totalBilled, currency)}
                    </span>
                  </div>

                  <button
                    onClick={() => onCreateInvoiceForClient(client.id)}
                    className="w-full py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-[#6D4AFF]/20 hover:border-[#6D4AFF]/40 hover:text-white text-xs font-semibold text-zinc-300 transition-all flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#2DD4BF]" />
                    <span>Create Invoice</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Client Modal */}
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
                  {editingClient ? 'Edit Client' : 'Add New Client'}
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
                  <label className="block text-zinc-400 mb-1 font-medium">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Innovations Ltd."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl dark-input"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Jane Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl dark-input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Email</label>
                    <input
                      type="email"
                      placeholder="billing@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl dark-input"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Phone</label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl dark-input"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Address</label>
                  <textarea
                    rows={2}
                    placeholder="Full street address..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
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
                    {editingClient ? 'Update Client' : 'Add Client'}
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
