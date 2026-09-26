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
import { EditorialBackground } from './EditorialBackground';

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
    <div className="min-h-screen text-[#F4E7C8] font-sans selection:bg-[#E85D3F]/40 selection:text-white relative">
      {/* Editorial Terracotta & Geometric Atmosphere Background */}
      <EditorialBackground />

      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#111111]/85 backdrop-blur-xl border-b border-[#F4E7C8]/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Logo */}
          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E85D3F] via-[#B84427] to-[#F3C352] p-[1.5px] shadow-lg shadow-[#E85D3F]/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-[#111111] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#F3C352]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-lg tracking-tight text-[#F4E7C8]">
                  Noir<span className="text-[#E85D3F]">Invoice</span>
                </span>
                <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-[#E85D3F]/20 text-[#F4E7C8] border border-[#E85D3F]/40 hidden sm:inline-block">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-[#D8CBB7] hidden sm:block">Modern SaaS Invoicing</p>
            </div>
          </div>

          {/* Desktop Navigation Center Pills */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-[#111111]/70 border border-[#F4E7C8]/15 rounded-2xl backdrop-blur-md shadow-lg">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-[#D8CBB7] hover:text-[#F4E7C8] hover:bg-white/[0.04]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-[#E85D3F]/30 backdrop-blur-md border border-[#E85D3F]/50 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#F3C352]' : 'text-[#D8CBB7]'}`} />
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Header Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/[0.05] border border-[#F4E7C8]/15 hover:bg-white/[0.1] text-xs font-medium text-[#F4E7C8] transition-colors"
                title="Change default currency"
                aria-label={`Select currency, current: ${currency}`}
                aria-expanded={currencyDropdownOpen}
              >
                <span className="text-[#F3C352] font-mono font-bold">
                  {CURRENCIES.find((c) => c.code === currency)?.symbol || '₹'}
                </span>
                <span className="text-[11px] sm:text-xs">{currency}</span>
                <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D8CBB7]" />
              </button>

              <AnimatePresence>
                {currencyDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-36 rounded-xl shadow-2xl p-1 z-50 bg-[#150E0C]/95 backdrop-blur-xl border border-[#F4E7C8]/20"
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
                            ? 'bg-[#E85D3F]/35 text-white font-semibold'
                            : 'text-[#D8CBB7] hover:bg-white/[0.08] hover:text-white'
                        }`}
                      >
                        <span>{c.code}</span>
                        <span className="text-[#F3C352] font-bold">{c.symbol}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications Button (hidden on narrow mobile < 400px to prevent overflow, accessible in drawer) */}
            <button
              className="hidden sm:flex relative p-2 rounded-xl bg-white/[0.05] border border-[#F4E7C8]/15 hover:bg-white/[0.1] text-[#D8CBB7] hover:text-[#F4E7C8] transition-colors"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F3C352] ring-2 ring-[#111111]" />
            </button>

            {/* Profile Avatar Button (hidden on mobile, accessible via navigation drawer) */}
            <button
              onClick={() => onNavigate('settings')}
              className="hidden sm:flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl bg-white/[0.05] border border-[#F4E7C8]/15 hover:bg-white/[0.1] transition-colors"
              aria-label="Studio Settings Profile"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#E85D3F] to-[#F3C352] flex items-center justify-center text-xs font-black text-[#111111] shadow-inner">
                NL
              </div>
              <span className="text-xs font-semibold text-[#F4E7C8] hidden lg:inline-block">Noir Labs</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/[0.05] border border-[#F4E7C8]/15 text-[#D8CBB7] hover:text-white focus:outline-none focus:ring-1 focus:ring-[#E85D3F]"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
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
              className="md:hidden border-t border-[#F4E7C8]/10 bg-[#111111]/95 backdrop-blur-2xl px-4 py-3 space-y-1.5 shadow-2xl"
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
                        ? 'bg-[#E85D3F]/30 border border-[#E85D3F]/50 text-white font-bold shadow-lg'
                        : 'text-[#D8CBB7] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#F3C352]' : 'text-[#D8CBB7]'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* Mobile Studio Profile Quick Link */}
              <div className="pt-2 border-t border-[#F4E7C8]/10 flex items-center justify-between px-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-[#E85D3F] to-[#F3C352] flex items-center justify-center text-[10px] font-black text-[#111111]">
                    NL
                  </div>
                  <span className="text-[#D8CBB7] font-medium">Noir Labs Studio</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-[#E85D3F] px-2 py-0.5 rounded-full bg-[#E85D3F]/15 border border-[#E85D3F]/30">
                  PRO Plan
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10">{children}</main>
    </div>
  );
}
