import React, { useState, useRef, useEffect } from 'react';
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
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  CreditCard,
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

const NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'Payment Received',
    desc: 'INV-1000 from XYZ Studio marked as paid (₹16,800)',
    time: '15m ago',
    unread: true,
  },
  {
    id: 'n2',
    title: 'Client Added',
    desc: 'Siraj Commentator added to client directory',
    time: '1h ago',
    unread: true,
  },
  {
    id: 'n3',
    title: 'Milestone Completed',
    desc: 'Broadcast delivery milestone approved for INV-1002',
    time: '3h ago',
    unread: false,
  },
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
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const currencyRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setCurrencyDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen text-[#F4E7C8] font-sans selection:bg-[#E85D3F]/40 selection:text-white relative">
      {/* Editorial Terracotta & Geometric Atmosphere Background */}
      <EditorialBackground />

      {/* Top Modern SaaS Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#111111]/80 backdrop-blur-2xl border-b border-[#F4E7C8]/10 shadow-[0_4px_30px_rgba(0,0,0,0.45)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* ======================================================== */}
          {/* 1. BRAND LOGO SECTION (Enhanced Visual Hierarchy)        */}
          {/* ======================================================== */}
          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3.5 cursor-pointer group select-none flex-shrink-0"
            title="NoirInvoice Dashboard"
          >
            <div className="relative">
              {/* Outer Ambient Glow */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#E85D3F] via-[#F3C352] to-[#B84427] opacity-35 blur-sm group-hover:opacity-75 transition-opacity duration-300" />
              
              {/* Logo Icon Box with Gradient Border */}
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1E110E] via-[#150E0C] to-[#25120E] border border-[#F4E7C8]/20 p-0.5 flex items-center justify-center shadow-xl group-hover:scale-105 group-hover:border-[#E85D3F]/60 transition-all duration-300">
                <div className="w-full h-full rounded-[14px] bg-[#111111]/95 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#F3C352] group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-xl tracking-tight text-white flex items-center">
                  Noir<span className="bg-gradient-to-r from-[#E85D3F] via-[#F07A5E] to-[#F3C352] bg-clip-text text-transparent">Invoice</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-[#E85D3F]/25 to-[#F3C352]/20 text-[#F4E7C8] border border-[#F3C352]/35 shadow-[0_0_12px_rgba(232,93,63,0.25)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F3C352] animate-pulse" />
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-[#D8CBB7]/80 font-medium tracking-wide hidden sm:block">
                Modern SaaS Invoicing
              </p>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 2. CENTER NAVIGATION PILLS (Smooth Spring Micro-Motion)  */}
          {/* ======================================================== */}
          <nav className="hidden md:flex items-center gap-1.5 p-1.5 bg-[#140C0A]/85 border border-[#F4E7C8]/15 rounded-2xl backdrop-blur-xl shadow-2xl relative">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`relative flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer select-none ${
                    isActive
                      ? 'text-white'
                      : 'text-[#D8CBB7] hover:text-[#F4E7C8] hover:bg-white/[0.05] hover:scale-[1.03]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-gradient-to-b from-[#E85D3F]/40 to-[#E85D3F]/15 border border-[#E85D3F]/60 rounded-xl shadow-[0_0_20px_rgba(232,93,63,0.35),inset_0_1px_1px_rgba(255,255,255,0.3)] backdrop-blur-md"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 transition-colors duration-200 ${isActive ? 'text-[#F3C352]' : 'text-[#D8CBB7]'}`} />
                    <span>{item.label}</span>
                  </span>
                </button>
              );
            })}
          </nav>

          {/* ======================================================== */}
          {/* 3. RIGHT CONTROLS (Dropdown, Notifications, Profile)    */}
          {/* ======================================================== */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Currency Selector Pill */}
            <div className="relative" ref={currencyRef}>
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] border border-[#F4E7C8]/15 hover:bg-white/[0.08] hover:border-[#E85D3F]/40 text-xs font-semibold text-[#F4E7C8] transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 shadow-sm"
                title="Change currency"
                aria-label={`Select currency, current is ${currency}`}
                aria-expanded={currencyDropdownOpen}
              >
                <span className="text-[#F3C352] font-mono font-bold">
                  {CURRENCIES.find((c) => c.code === currency)?.symbol || '₹'}
                </span>
                <span className="text-xs">{currency}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    currencyDropdownOpen ? 'rotate-180 text-[#E85D3F]' : 'text-[#D8CBB7]'
                  }`}
                />
              </button>

              <AnimatePresence>
                {currencyDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-40 rounded-2xl shadow-2xl p-1.5 z-50 bg-[#150E0C]/95 backdrop-blur-2xl border border-[#F4E7C8]/20"
                  >
                    <div className="px-2 py-1 text-[10px] font-bold text-[#D8CBB7]/70 uppercase tracking-wider">
                      Select Currency
                    </div>
                    {CURRENCIES.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          onCurrencyChange(c.code);
                          setCurrencyDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          currency === c.code
                            ? 'bg-gradient-to-r from-[#E85D3F]/40 to-[#E85D3F]/20 text-white font-bold border border-[#E85D3F]/40 shadow-sm'
                            : 'text-[#D8CBB7] hover:bg-white/[0.08] hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="text-[#F3C352] font-mono font-bold">{c.symbol}</span>
                          <span>{c.code}</span>
                        </span>
                        {currency === c.code && <CheckCircle2 className="w-3.5 h-3.5 text-[#F3C352]" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notification Bell with Numeric Badge */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="hidden sm:flex relative p-2.5 rounded-xl bg-white/[0.04] border border-[#F4E7C8]/15 hover:bg-white/[0.08] hover:border-[#E85D3F]/40 text-[#D8CBB7] hover:text-[#F4E7C8] transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 shadow-sm"
                title="Notifications (2 unread)"
                aria-label="View notifications, 2 unread"
                aria-expanded={notificationsOpen}
              >
                <Bell className="w-4 h-4" />
                {/* Numeric Pill Badge */}
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-black font-mono bg-gradient-to-r from-[#E85D3F] to-[#B84427] text-white ring-2 ring-[#111111] shadow-[0_0_10px_rgba(232,93,63,0.5)] animate-pulse">
                  2
                </span>
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl p-3 z-50 bg-[#150E0C]/95 backdrop-blur-2xl border border-[#F4E7C8]/20"
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F4E7C8]/10">
                      <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#F4E7C8]">
                        Notifications
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E85D3F]/20 text-[#F3C352] font-mono font-bold">
                        2 new
                      </span>
                    </div>

                    <div className="space-y-2">
                      {NOTIFICATIONS.map((n) => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-xl border text-xs transition-colors ${
                            n.unread
                              ? 'bg-white/[0.05] border-[#E85D3F]/30 text-white'
                              : 'bg-transparent border-transparent text-[#D8CBB7]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-[#F4E7C8]">{n.title}</span>
                            <span className="text-[10px] text-[#D8CBB7]/60 font-mono">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-[#D8CBB7]/80 leading-snug">{n.desc}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile Pill */}
            <button
              onClick={() => onNavigate('settings')}
              className="hidden sm:flex items-center gap-3 p-1.5 pl-2 pr-3.5 rounded-2xl bg-white/[0.04] border border-[#F4E7C8]/15 hover:bg-white/[0.08] hover:border-[#E85D3F]/40 transition-all duration-200 cursor-pointer group hover:scale-[1.02] active:scale-95 shadow-sm"
              title="Studio Profile & Settings"
              aria-label="Studio Profile & Settings"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#E85D3F] via-[#B84427] to-[#F3C352] p-0.5 shadow-md shadow-[#E85D3F]/20 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full bg-[#111111] rounded-[10px] flex items-center justify-center text-xs font-black text-[#F4E7C8]">
                    NL
                  </div>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#111111]" />
              </div>
              <div className="text-left hidden lg:block">
                <div className="text-xs font-bold text-[#F4E7C8] group-hover:text-white transition-colors">
                  Noir Labs
                </div>
                <div className="text-[10px] text-[#D8CBB7]/70 font-medium">
                  Studio Workspace
                </div>
              </div>
            </button>

            {/* Mobile Menu Hamburger Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-white/[0.05] border border-[#F4E7C8]/15 text-[#D8CBB7] hover:text-white hover:border-[#E85D3F]/50 transition-colors focus:outline-none cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#E85D3F]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 4. MOBILE SLIDE-DOWN DRAWER (Responsive & Cohesive)      */}
        {/* ======================================================== */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="md:hidden border-t border-[#F4E7C8]/15 bg-[#120B0A]/95 backdrop-blur-3xl px-4 py-4 space-y-4 shadow-2xl"
            >
              {/* User Profile Card in Drawer */}
              <div
                onClick={() => {
                  onNavigate('settings');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-[#F4E7C8]/15 cursor-pointer hover:bg-white/[0.08] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#E85D3F] to-[#F3C352] p-0.5">
                      <div className="w-full h-full bg-[#111111] rounded-[10px] flex items-center justify-center text-xs font-black text-[#F4E7C8]">
                        NL
                      </div>
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#111111]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Noir Labs Studio</div>
                    <div className="text-[11px] text-[#D8CBB7]/70">juzer09jawadwala@gmail.com</div>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-black text-[#F3C352] px-2 py-0.5 rounded-full bg-[#E85D3F]/20 border border-[#E85D3F]/40">
                  PRO Plan
                </span>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1">
                <div className="px-2 py-1 text-[10px] font-bold text-[#D8CBB7]/60 uppercase tracking-wider">
                  Menu
                </div>
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
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-[#E85D3F]/40 to-[#E85D3F]/20 border border-[#E85D3F]/60 text-white shadow-lg shadow-[#E85D3F]/20'
                          : 'text-[#D8CBB7] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#F3C352]' : 'text-[#D8CBB7]'}`} />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#F3C352]" />}
                    </button>
                  );
                })}
              </div>

              {/* Mobile Notifications Preview */}
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-[#F4E7C8]/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D8CBB7]">
                    Recent Activity
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#E85D3F]/20 text-[#F3C352] font-bold">
                    2 unread
                  </span>
                </div>
                <div className="text-xs text-[#D8CBB7] flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="truncate">INV-1000 from XYZ Studio marked as paid</span>
                </div>
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
