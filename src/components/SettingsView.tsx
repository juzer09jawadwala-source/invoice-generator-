import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Save,
  Building2,
  Globe,
  Mail,
  Phone,
  FileCheck,
  MapPin,
  Image,
  Percent,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { AppSettings, CurrencyCode, CompanyDetails } from '../types';
import { useToast } from './Toast';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
}

export function SettingsView({ settings, onUpdateSettings }: SettingsViewProps) {
  const { showToast } = useToast();
  const [formCompany, setFormCompany] = useState<CompanyDetails>(settings.company);
  const [formCurrency, setFormCurrency] = useState<CurrencyCode>(settings.defaultCurrency);
  const [formTaxRate, setFormTaxRate] = useState<number>(settings.defaultTaxRate);
  const [formTerms, setFormTerms] = useState<string>(settings.defaultTerms.join('\n'));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      company: formCompany,
      defaultCurrency: formCurrency,
      defaultTaxRate: Number(formTaxRate) || 18,
      defaultTerms: formTerms.split('\n').filter((t) => t.trim() !== ''),
    });
    showToast('Studio settings saved successfully', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">Studio Settings</h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Configure your studio identity, tax credentials, default currency, and invoice terms
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Company Profile Card */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5 shadow-2xl">
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-[#A855F7] flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-white">Company & Studio Identity</h2>
              <p className="text-xs text-zinc-400">Information displayed on all generated invoices</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-zinc-400 font-medium">Studio / Company Name</label>
              <input
                type="text"
                required
                value={formCompany.name}
                onChange={(e) => setFormCompany({ ...formCompany, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl dark-input"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium">Email Address</label>
              <input
                type="email"
                required
                value={formCompany.email}
                onChange={(e) => setFormCompany({ ...formCompany, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl dark-input"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium">Phone Number</label>
              <input
                type="text"
                value={formCompany.phone}
                onChange={(e) => setFormCompany({ ...formCompany, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl dark-input"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium">Website URL</label>
              <input
                type="text"
                value={formCompany.website}
                onChange={(e) => setFormCompany({ ...formCompany, website: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl dark-input"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium">GSTIN / Tax ID Number</label>
              <input
                type="text"
                value={formCompany.gstNumber}
                onChange={(e) => setFormCompany({ ...formCompany, gstNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl dark-input font-mono"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-zinc-400 font-medium">Registered Address</label>
              <textarea
                rows={2}
                value={formCompany.address}
                onChange={(e) => setFormCompany({ ...formCompany, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl dark-input"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-zinc-400 font-medium">Logo Image URL (optional)</label>
              <input
                type="text"
                placeholder="https://example.com/logo.png"
                value={formCompany.logoUrl || ''}
                onChange={(e) => setFormCompany({ ...formCompany, logoUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl dark-input"
              />
            </div>
          </div>
        </div>

        {/* 2. Defaults & Terms Card */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5 shadow-2xl">
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-[#2DD4BF] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-white">Invoice Defaults & Terms</h2>
              <p className="text-xs text-zinc-400">Default settings prefilled on every new invoice</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium">Default Currency</label>
              <select
                value={formCurrency}
                onChange={(e) => setFormCurrency(e.target.value as CurrencyCode)}
                className="w-full px-3.5 py-2.5 rounded-xl dark-input"
              >
                <option value="INR" className="bg-[#151027]">INR (₹ - Indian Rupee)</option>
                <option value="USD" className="bg-[#151027]">USD ($ - US Dollar)</option>
                <option value="EUR" className="bg-[#151027]">EUR (€ - Euro)</option>
                <option value="GBP" className="bg-[#151027]">GBP (£ - British Pound)</option>
                <option value="AED" className="bg-[#151027]">AED (AED - UAE Dirham)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium">Default Tax Rate (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formTaxRate}
                onChange={(e) => setFormTaxRate(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl dark-input font-mono"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-zinc-400 font-medium">
                Standard Terms & Conditions <span className="text-zinc-500 font-normal">(one per line)</span>
              </label>
              <textarea
                rows={5}
                value={formTerms}
                onChange={(e) => setFormTerms(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl dark-input font-mono leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#6D4AFF] via-[#8B5CF6] to-[#2DD4BF] text-white font-heading font-bold text-sm tracking-wide shadow-xl shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all glow-btn cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
