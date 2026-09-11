import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  FileText,
  Users,
  Briefcase,
  Settings,
  Bell,
  Menu,
  X,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { CurrencyCode } from '../types';

export type AppView = 'dashboard' | 'invoices' | 'clients' | 'services' | 'settings';

interface AppShellProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  currency: CurrencyCode;
  onCurrencyChange: (c: CurrencyCode) => void;
  children: React.ReactNode;
}

const NAV_ITEMS: { id: AppView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'invoices', label: 'Invoices', icon: FileText },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'services', label: 'Services', icon: Briefcase },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const CURRENCIES: { code: CurrencyCode; symbol: string; label: string }[] = [
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'AED', symbol: 'AED', label: 'AED' },
];

export function AppShell({
  currentView,
  onNavigate,
  currency,
  onCurrencyChange,
  children,
}: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen text-[#FFFFFF] font-sans selection:bg-[#A855F7]/30 selection:text-white relative">
      {/* Background Image Container */}
      <div 
        className="fixed inset-0 pointer-events-none -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/app-bg.jpg')` }}
      >
        {/* Semi-transparent dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-[#0B0918]/50 backdrop-blur-[2px]" />
      </div>

      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#0B0918]/80 backdrop-blur-xl border-b border-white/[0.08] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Logo */}
          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6D4AFF] via-[#8B5CF6] to-[#22D3EE] p-[1.5px] shadow-lg shadow-purple-900/30 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-[#100C22] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#2DD4BF]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-lg tracking-tight text-white">
                  Noir<span className="text-[#2DD4BF]">Invoice</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-[#6D4AFF]/20 text-[#A855F7] border border-[#6D4AFF]/30 hidden sm:inline-block">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">Modern SaaS Invoicing</p>
            </div>
          </div>

          {/* Desktop Navigation Center Pills */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-white/[0.03] border border-white/[0.07] rounded-2xl backdrop-blur-md">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-white'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Header Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.09] hover:bg-white/[0.08] text-xs font-medium text-zinc-200 transition-colors"
                title="Change default currency"
              >
                <span className="text-[#2DD4BF] font-mono font-semibold">
                  {CURRENCIES.find((c) => c.code === currency)?.symbol || '₹'}
                </span>
                <span>{currency}</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              <AnimatePresence>
                {currencyDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-36 rounded-xl glass-panel shadow-2xl p-1 z-50 bg-[#151027]/95 backdrop-blur-xl border border-white/10"
                  >
                    {CURRENCIES.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          onCurrencyChange(c.code);
                          setCurrencyDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          currency === c.code
                            ? 'bg-[#6D4AFF]/30 text-white font-semibold'
                            : 'text-zinc-300 hover:bg-white/[0.06] hover:text-white'
                        }`}
                      >
                        <span>{c.code}</span>
                        <span className="text-[#2DD4BF]">{c.symbol}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications Button */}
            <button
              className="relative p-2 rounded-xl bg-white/[0.04] border border-white/[0.09] hover:bg-white/[0.08] text-zinc-300 hover:text-white transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2DD4BF] ring-2 ring-[#0B0918]" />
            </button>

            {/* Profile Avatar Button */}
            <button
              onClick={() => onNavigate('settings')}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl bg-white/[0.04] border border-white/[0.09] hover:bg-white/[0.08] transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#6D4AFF] to-[#2DD4BF] flex items-center justify-center text-xs font-bold text-white shadow-inner">
                NL
              </div>
              <span className="text-xs font-medium text-zinc-200 hidden lg:inline-block">Noir Labs</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/[0.04] border border-white/[0.09] text-zinc-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-white/10 bg-[#0B0918]/95 backdrop-blur-2xl px-4 py-3 space-y-1"
            >
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'glass-btn text-white shadow-lg'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10">{children}</main>
    </div>
  );
}
