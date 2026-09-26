"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  ChevronDown,
  CheckCircle2,
  Bell,
  Menu,
  X,
  LayoutDashboard,
  FileText,
  Users,
  Briefcase,
  Settings,
} from "lucide-react";
import { CurrencyCode } from "@/types";

export type AppView = "dashboard" | "invoices" | "clients" | "services" | "settings";

interface InkFrameHeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  currency: CurrencyCode;
  onCurrencyChange: (code: CurrencyCode) => void;
}

const CURRENCIES: { code: CurrencyCode; label: string; symbol: string }[] = [
  { code: "INR", label: "Indian Rupee", symbol: "₹" },
  { code: "USD", label: "US Dollar", symbol: "$" },
  { code: "EUR", label: "Euro", symbol: "€" },
  { code: "GBP", label: "British Pound", symbol: "£" },
  { code: "AED", label: "UAE Dirham", symbol: "AED " },
];

const NAV_ITEMS: { id: AppView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "invoices", label: "Invoices", icon: FileText },
  { id: "clients", label: "Clients", icon: Users },
  { id: "services", label: "Services", icon: Briefcase },
  { id: "settings", label: "Settings", icon: Settings },
];

const NOTIFICATIONS = [
  {
    id: "n1",
    title: "Invoice Paid",
    desc: "Siraj Commentary Studio settled INV-1004 (₹45,000)",
    time: "10m ago",
    unread: true,
  },
  {
    id: "n2",
    title: "New Client Added",
    desc: "Apex Media Group added to client directory",
    time: "1h ago",
    unread: true,
  },
  {
    id: "n3",
    title: "Milestone Completed",
    desc: "Broadcast delivery milestone approved for INV-1002",
    time: "3h ago",
    unread: false,
  },
];

export function InkFrameHeader({
  currentView,
  onNavigate,
  currency,
  onCurrencyChange,
}: InkFrameHeaderProps) {
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0D0706]/90 backdrop-blur-2xl border-b border-[#F4E7C8]/10 shadow-[0_8px_32px_rgba(0,0,0,0.65)] select-none">
      
      {/* Outer Banner Canvas with Inset Framing & Organic Sumi-e Ink Smoke */}
      <div className="relative max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-2 sm:py-2.5">
        
        {/* ======================================================== */}
        {/* 1. TOP-LEFT SUMI-E INK SMOKE PLUME (From Reference 1)    */}
        {/* ======================================================== */}
        <div className="absolute top-0 left-0 w-44 sm:w-64 md:w-80 h-full pointer-events-none z-0 overflow-visible opacity-90 sm:opacity-95">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 320 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="inkGlowLeft" cx="20%" cy="15%" r="70%">
                <stop offset="0%" stopColor="#050202" stopOpacity="0.98" />
                <stop offset="45%" stopColor="#150B08" stopOpacity="0.85" />
                <stop offset="75%" stopColor="#2A120D" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#0D0706" stopOpacity="0" />
              </radialGradient>
              <filter id="inkBlurSoft" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" />
              </filter>
              <filter id="inkMist" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="8" />
              </filter>
            </defs>

            {/* Background Mist Cloud */}
            <path
              d="M-30,-20 C20,-30 65,-10 90,15 C115,40 125,75 95,95 C65,115 15,110 -20,100 Z"
              fill="url(#inkGlowLeft)"
              filter="url(#inkMist)"
              opacity="0.75"
            />

            {/* Main Billowing Corner Cloud */}
            <path
              d="M-20,-10 C15,-15 50,0 65,22 C80,45 85,68 70,88 C52,108 20,112 -15,95 C-30,85 -40,40 -20,-10 Z"
              fill="#060302"
              opacity="0.9"
            />

            {/* Organic Lobes wrapping over border */}
            <path
              d="M10,0 C32,-5 58,8 68,26 C78,44 70,65 52,72 C35,80 18,75 5,60 C-5,50 0,10 10,0 Z"
              fill="#100705"
              opacity="0.8"
            />

            {/* Delicate Smoke Wisps and Tendrils */}
            <path
              d="M45,15 C65,18 88,32 94,50 C100,68 85,82 68,78 C52,74 60,52 75,45 C90,38 115,42 125,58"
              stroke="#0A0403"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.65"
              filter="url(#inkBlurSoft)"
            />
            <path
              d="M15,40 C35,48 55,62 58,82 C60,95 48,105 32,104 C18,102 12,88 20,78 C28,68 40,70 48,76"
              stroke="#150B08"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />

            {/* Fine Ink Bleed Droplets */}
            <circle cx="92" cy="38" r="1.5" fill="#080302" opacity="0.6" />
            <circle cx="106" cy="62" r="1.2" fill="#080302" opacity="0.5" />
            <circle cx="48" cy="102" r="1.8" fill="#080302" opacity="0.7" />
            <circle cx="78" cy="88" r="1.2" fill="#E85D3F" opacity="0.4" />
          </svg>
        </div>

        {/* ======================================================== */}
        {/* 2. TOP-RIGHT MASSIVE BILLOWING INK PLUME (From Ref 1)    */}
        {/* ======================================================== */}
        <div className="absolute top-0 right-0 w-56 sm:w-80 md:w-96 h-full pointer-events-none z-0 overflow-visible opacity-95">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 380 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="inkGlowRight" cx="80%" cy="15%" r="75%">
                <stop offset="0%" stopColor="#040202" stopOpacity="0.99" />
                <stop offset="35%" stopColor="#120705" stopOpacity="0.92" />
                <stop offset="65%" stopColor="#25100B" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#0D0706" stopOpacity="0" />
              </radialGradient>
              <filter id="inkBlurRight" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" />
              </filter>
              <filter id="inkMistRight" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="9" />
              </filter>
            </defs>

            {/* Deep Volumetric Smoke Base */}
            <path
              d="M410,-20 C360,-25 310,-10 270,18 C230,46 220,85 245,108 C270,130 330,135 410,125 Z"
              fill="url(#inkGlowRight)"
              filter="url(#inkMistRight)"
              opacity="0.85"
            />

            {/* Core Billowing Plume entering from Top-Right */}
            <path
              d="M400,-10 C365,-12 328,5 295,28 C265,50 252,80 270,102 C290,122 345,124 400,115 Z"
              fill="#060302"
              opacity="0.95"
            />

            {/* Swelling Organic Lobes (Reference 1 Signature Silhouette) */}
            <path
              d="M375,0 C345,2 315,18 292,42 C272,64 270,88 288,100 C306,110 342,108 375,98 Z"
              fill="#0F0604"
              opacity="0.88"
            />
            <path
              d="M340,15 C310,25 285,45 272,68 C260,90 275,108 298,106 C320,104 345,88 355,70 Z"
              fill="#180A07"
              opacity="0.75"
            />

            {/* Delicate Curling Smoke Wisps spilling toward the Center Nav */}
            <path
              d="M310,28 C280,34 255,48 240,68 C228,85 235,102 254,106 C272,110 285,98 280,84 C275,70 258,72 245,78"
              stroke="#080302"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
              filter="url(#inkBlurRight)"
            />
            <path
              d="M335,42 C305,52 278,70 265,92 C255,108 240,118 220,112 C205,106 208,92 222,86 C236,80 252,82 262,90"
              stroke="#1A0D09"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
              opacity="0.65"
            />

            {/* Floating Amber & Charcoal Micro-Embers */}
            <circle cx="235" cy="54" r="1.5" fill="#0A0403" opacity="0.6" />
            <circle cx="218" cy="78" r="1.2" fill="#F3C352" opacity="0.45" />
            <circle cx="250" cy="98" r="1.4" fill="#E85D3F" opacity="0.4" />
            <circle cx="276" cy="112" r="1.6" fill="#0A0403" opacity="0.7" />
          </svg>
        </div>

        {/* ======================================================== */}
        {/* 3. INNER ARCHITECTURAL FRAME (Direct from Reference 1)   */}
        {/* ======================================================== */}
        <div className="relative z-10 w-full rounded-sm border border-[#F4E7C8]/25 sm:border-[#F4E7C8]/30 bg-[#120B0A]/75 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_4px_24px_rgba(0,0,0,0.5)] transition-all duration-300">
          
          {/* Architectural Corner Registration Ticks (Drafting crosshairs like Ref 1) */}
          <div className="absolute -top-[5px] -left-[5px] w-2.5 h-2.5 border-t border-l border-[#F4E7C8]/50 pointer-events-none" />
          <div className="absolute -top-[5px] -right-[5px] w-2.5 h-2.5 border-t border-r border-[#F4E7C8]/50 pointer-events-none" />
          <div className="absolute -bottom-[5px] -left-[5px] w-2.5 h-2.5 border-b border-l border-[#F4E7C8]/50 pointer-events-none" />
          <div className="absolute -bottom-[5px] -right-[5px] w-2.5 h-2.5 border-b border-r border-[#F4E7C8]/50 pointer-events-none" />

          {/* Inner Content Layout inside the Frame */}
          <div className="h-15 sm:h-16 px-3 sm:px-5 flex items-center justify-between gap-3 sm:gap-4">
            
            {/* ---------------------------------------------------- */}
            {/* BRAND LOGO: Architectural & Minimalist               */}
            {/* ---------------------------------------------------- */}
            <div
              onClick={() => onNavigate("dashboard")}
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none flex-shrink-0"
              title="NoirInvoice Dashboard"
            >
              {/* Geometric Icon Box with hairline border */}
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-sm bg-[#1A0E0B] border border-[#F4E7C8]/30 flex items-center justify-center shadow-md group-hover:border-[#E85D3F]/70 transition-colors duration-200">
                <Sparkles className="w-4 h-4 text-[#F3C352] group-hover:rotate-12 transition-transform duration-300" />
              </div>

              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-heading font-black text-base sm:text-lg tracking-tight text-white flex items-center">
                    Noir<span className="bg-gradient-to-r from-[#E85D3F] via-[#F07A5E] to-[#F3C352] bg-clip-text text-transparent">Invoice</span>
                  </span>
                  
                  {/* Architectural hairline badge */}
                  <span className="inline-flex items-center gap-1 text-[8px] sm:text-[9px] font-mono font-bold tracking-widest uppercase px-1.5 py-0.5 rounded-sm bg-[#E85D3F]/15 text-[#F4E7C8] border border-[#F4E7C8]/25 shadow-sm">
                    <span className="w-1 h-1 rounded-full bg-[#F3C352] animate-pulse" />
                    PRO
                  </span>
                </div>
                <p className="text-[10px] text-[#D8CBB7]/70 font-mono tracking-wider uppercase hidden md:block">
                  Studio Edition
                </p>
              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* CENTER NAVIGATION: Architectural Framed Buttons      */}
            {/* ---------------------------------------------------- */}
            <nav className="hidden md:flex items-center gap-1 sm:gap-1.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`relative flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-sm text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer select-none border ${
                      isActive
                        ? "bg-gradient-to-b from-[#E85D3F]/25 to-[#E85D3F]/10 text-white border-[#E85D3F]/70 shadow-[0_0_14px_rgba(232,93,63,0.25)]"
                        : "text-[#D8CBB7]/85 hover:text-white hover:bg-white/[0.04] border-transparent hover:border-[#F4E7C8]/20"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="inkActiveNavIndicator"
                        className="absolute inset-0 rounded-sm bg-transparent pointer-events-none"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      />
                    )}
                    <Icon
                      className={`w-3.5 h-3.5 transition-colors duration-200 ${
                        isActive ? "text-[#F3C352]" : "text-[#D8CBB7]/70"
                      }`}
                    />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#F3C352] rounded-full shadow-[0_0_6px_#F3C352]" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* ---------------------------------------------------- */}
            {/* RIGHT CONTROLS: Adjusted Architectural Buttons       */}
            {/* ---------------------------------------------------- */}
            <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
              
              {/* 1. Currency Selector (Crisp Framed Box) */}
              <div className="relative" ref={currencyRef}>
                <button
                  onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm bg-white/[0.03] border border-[#F4E7C8]/20 hover:border-[#E85D3F]/60 hover:bg-white/[0.06] text-xs font-mono font-medium text-[#F4E7C8] hover:text-white transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
                  title="Change currency"
                  aria-label={`Select currency, current is ${currency}`}
                  aria-expanded={currencyDropdownOpen}
                >
                  <span className="text-[#F3C352] font-bold">
                    {CURRENCIES.find((c) => c.code === currency)?.symbol || "₹"}
                  </span>
                  <span className="text-[11px] font-bold tracking-wider">{currency}</span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-200 ${
                      currencyDropdownOpen ? "rotate-180 text-[#E85D3F]" : "text-[#D8CBB7]"
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {currencyDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-42 rounded-sm shadow-2xl p-1 z-50 bg-[#140C0A]/95 backdrop-blur-2xl border border-[#F4E7C8]/25"
                    >
                      <div className="px-2.5 py-1 text-[9px] font-mono font-bold text-[#D8CBB7]/70 uppercase tracking-widest border-b border-[#F4E7C8]/10 mb-1">
                        Currencies
                      </div>
                      {CURRENCIES.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => {
                            onCurrencyChange(c.code);
                            setCurrencyDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-sm text-xs font-medium transition-all cursor-pointer ${
                            currency === c.code
                              ? "bg-[#E85D3F]/25 text-white font-bold border border-[#E85D3F]/50 shadow-sm"
                              : "text-[#D8CBB7] hover:bg-white/[0.06] hover:text-white border border-transparent"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-[#F3C352] font-mono font-bold">{c.symbol}</span>
                            <span className="font-mono text-[11px]">{c.code}</span>
                          </span>
                          {currency === c.code && <CheckCircle2 className="w-3 h-3 text-[#F3C352]" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 2. Notification Bell (Architectural Box with Ink Dot) */}
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="hidden sm:flex relative p-2 rounded-sm bg-white/[0.03] border border-[#F4E7C8]/20 hover:border-[#E85D3F]/60 hover:bg-white/[0.06] text-[#D8CBB7] hover:text-white transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
                  title="Notifications (2 unread)"
                  aria-label="View notifications, 2 unread"
                  aria-expanded={notificationsOpen}
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#E85D3F] ring-1 ring-[#111111] animate-pulse" />
                </button>

                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-76 sm:w-80 rounded-sm shadow-2xl p-2.5 z-50 bg-[#140C0A]/95 backdrop-blur-2xl border border-[#F4E7C8]/25"
                    >
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F4E7C8]/10">
                        <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#F4E7C8]">
                          Notifications
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-[#E85D3F]/20 text-[#F3C352] font-mono font-bold border border-[#E85D3F]/40">
                          2 unread
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {NOTIFICATIONS.map((n) => (
                          <div
                            key={n.id}
                            className={`p-2 rounded-sm border text-xs transition-colors ${
                              n.unread
                                ? "bg-white/[0.05] border-[#E85D3F]/30 text-white"
                                : "bg-transparent border-transparent text-[#D8CBB7]"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="font-bold text-[#F4E7C8] text-xs">{n.title}</span>
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

              {/* 3. Studio Profile (Framed Architectural Lockup) */}
              <button
                onClick={() => onNavigate("settings")}
                className="hidden sm:flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-sm bg-white/[0.03] border border-[#F4E7C8]/20 hover:border-[#E85D3F]/60 hover:bg-white/[0.06] transition-all duration-200 cursor-pointer group shadow-sm active:scale-95"
                title="Studio Profile & Settings"
                aria-label="Studio Profile & Settings"
              >
                <div className="relative">
                  <div className="w-6 h-6 rounded-sm bg-[#1E0F0C] border border-[#E85D3F]/50 flex items-center justify-center text-[10px] font-mono font-black text-[#F3C352]">
                    NL
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 ring-1 ring-[#111111]" />
                </div>
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-bold text-[#F4E7C8] group-hover:text-white transition-colors leading-tight">
                    Noir Labs
                  </div>
                </div>
              </button>

              {/* 4. Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-sm bg-white/[0.03] border border-[#F4E7C8]/20 text-[#D8CBB7] hover:text-white hover:border-[#E85D3F]/60 transition-colors focus:outline-none cursor-pointer"
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-4 h-4 text-[#E85D3F]" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. MOBILE SLIDE-DOWN DRAWER (Framed & Responsive)        */}
      {/* ======================================================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="md:hidden border-t border-[#F4E7C8]/15 bg-[#100908]/98 backdrop-blur-3xl px-4 py-4 space-y-4 shadow-2xl"
          >
            {/* User Profile in Drawer */}
            <div
              onClick={() => {
                onNavigate("settings");
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between p-3 rounded-sm bg-white/[0.04] border border-[#F4E7C8]/20 cursor-pointer hover:bg-white/[0.08] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-sm bg-[#1E0F0C] border border-[#E85D3F]/50 flex items-center justify-center text-xs font-mono font-bold text-[#F4E7C8]">
                    NL
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#111111]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Noir Labs Studio</div>
                  <div className="text-[11px] text-[#D8CBB7]/70 font-mono">juzer09jawadwala@gmail.com</div>
                </div>
              </div>
              <span className="text-[9px] uppercase font-mono font-bold text-[#F3C352] px-2 py-0.5 rounded-sm bg-[#E85D3F]/20 border border-[#E85D3F]/40">
                PRO Plan
              </span>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1">
              <div className="px-2 py-1 text-[9px] font-mono font-bold text-[#D8CBB7]/60 uppercase tracking-widest">
                Navigation
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
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-sm text-sm font-semibold transition-all cursor-pointer border ${
                      isActive
                        ? "bg-[#E85D3F]/20 border-[#E85D3F]/60 text-white shadow-md shadow-[#E85D3F]/20"
                        : "border-transparent text-[#D8CBB7] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? "text-[#F3C352]" : "text-[#D8CBB7]"}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#F3C352]" />}
                  </button>
                );
              })}
            </div>

            {/* Mobile Notification Preview */}
            <div className="p-3 rounded-sm bg-white/[0.03] border border-[#F4E7C8]/15 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#D8CBB7]">
                  Latest Activity
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-[#E85D3F]/20 text-[#F3C352] font-mono font-bold border border-[#E85D3F]/30">
                  2 unread
                </span>
              </div>
              <div className="text-xs text-[#D8CBB7] flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="truncate">Siraj Commentary Studio settled INV-1004</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
