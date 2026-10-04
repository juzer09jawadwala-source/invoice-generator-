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
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { AppSettings, CurrencyCode, CompanyDetails } from '../types';
import { useToast } from './Toast';
import { useAuth } from '@/context/AuthContext';
import { GoogleSignInButton } from './GoogleSignInButton';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
}

export function SettingsView({ settings, onUpdateSettings }: SettingsViewProps) {
  const { showToast } = useToast();
  const { user, logout, isAuthenticated } = useAuth();
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-off-white">Studio Settings</h1>
        <p className="text-xs sm:text-sm text-light-gray mt-1">
          Configure your studio identity, tax credentials, default currency, and invoice terms
        </p>
      </div>

      {/* Google Account & Identity Card */}
      <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-off-white/15 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-off-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-off-white to-soft-gray p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-soft-gray" />
              </div>
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-off-white">Google Account & Security</h2>
              <p className="text-xs text-light-gray">Authentication state and Google Identity profile</p>
            </div>
          </div>
          {isAuthenticated && (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-400 bg-graphite/10 border border-graphite/30 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connected
            </span>
          )}
        </div>

        {isAuthenticated && user ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.03] border border-off-white/15">
            <div className="flex items-center gap-3.5">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-off-white/50 shadow-md"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-deep-graphite border border-off-white/40 flex items-center justify-center text-sm font-bold text-soft-gray">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{user.name}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-xs text-light-gray font-mono">{user.email}</div>
                <div className="text-[10px] text-light-gray/60 mt-0.5">Google ID: {user.sub.slice(0, 8)}••••••••</div>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-graphite/10 hover:bg-graphite/20 text-light-gray border border-graphite/25 text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Disconnect Google</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.03] border border-off-white/15">
            <div className="space-y-1">
              <div className="text-sm font-bold text-white">Sign in to link your Google account</div>
              <p className="text-xs text-light-gray">
                Enables verified identity, avatar display, and session synchronization across devices.
              </p>
            </div>
            <div className="self-start sm:self-auto">
              <GoogleSignInButton />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Company Profile Card */}
        <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-off-white/15 space-y-5 shadow-2xl">
          <div className="flex items-center gap-3 pb-3 border-b border-off-white/10">
            <div className="w-8 h-8 rounded-xl bg-off-white/20 text-off-white flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-off-white">Company & Studio Identity</h2>
              <p className="text-xs text-light-gray">Information displayed on all generated invoices</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-light-gray font-medium">Studio / Company Name</label>
              <input
                type="text"
                required
                value={formCompany.name}
                onChange={(e) => setFormCompany({ ...formCompany, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl dark-input"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-light-gray font-medium">Email Address</label>
              <input
                type="email"
                required
                value={formCompany.email}
                onChange={(e) => setFormCompany({ ...formCompany, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl dark-input"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-light-gray font-medium">Phone Number</label>
              <input
                type="text"
                value={formCompany.phone}
                onChange={(e) => setFormCompany({ ...formCompany, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl dark-input"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-light-gray font-medium">Website URL</label>
              <input
                type="text"
                value={formCompany.website}
                onChange={(e) => setFormCompany({ ...formCompany, website: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl dark-input"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-light-gray font-medium">GSTIN / Tax ID Number</label>
              <input
                type="text"
                value={formCompany.gstNumber}
                onChange={(e) => setFormCompany({ ...formCompany, gstNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl dark-input font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-light-gray font-medium">UPI Payment ID / VPA</label>
              <input
                type="text"
                placeholder="e.g. yourname@okaxisbank"
                value={formCompany.upiId || ''}
                onChange={(e) => setFormCompany({ ...formCompany, upiId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl dark-input font-mono text-soft-gray"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-light-gray font-medium">Registered Address</label>
              <textarea
                rows={2}
                value={formCompany.address}
                onChange={(e) => setFormCompany({ ...formCompany, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl dark-input"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-light-gray font-medium">Logo Image URL (optional)</label>
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
        <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-off-white/15 space-y-5 shadow-2xl">
          <div className="flex items-center gap-3 pb-3 border-b border-off-white/10">
            <div className="w-8 h-8 rounded-xl bg-soft-gray/20 text-soft-gray flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-off-white">Invoice Defaults & Terms</h2>
              <p className="text-xs text-light-gray">Default settings prefilled on every new invoice</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-light-gray font-medium">Default Currency</label>
              <select
                value={formCurrency}
                onChange={(e) => setFormCurrency(e.target.value as CurrencyCode)}
                className="w-full px-3.5 py-2.5 rounded-xl dark-input"
              >
                <option value="INR" className="bg-deep-graphite">INR (₹ - Indian Rupee)</option>
                <option value="USD" className="bg-deep-graphite">USD ($ - US Dollar)</option>
                <option value="EUR" className="bg-deep-graphite">EUR (€ - Euro)</option>
                <option value="GBP" className="bg-deep-graphite">GBP (£ - British Pound)</option>
                <option value="AED" className="bg-deep-graphite">AED (AED - UAE Dirham)</option>
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
            className="flex items-center gap-2 px-6 py-3 rounded-2xl glass-btn text-white font-heading font-bold text-sm tracking-wide cursor-pointer disabled:opacity-75"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
