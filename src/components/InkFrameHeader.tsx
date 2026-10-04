"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown,
  Bell,
  X,
  Search,
  Check,
  LogOut,
  SlidersHorizontal,
  ExternalLink,
} from "lucide-react";
import { CurrencyCode } from "@/types";
import { useAuth } from "@/context/AuthContext";

export type AppView = "dashboard" | "invoices" | "clients" | "services" | "settings";

interface InkFrameHeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  currency: CurrencyCode;
  onCurrencyChange: (code: CurrencyCode) => void;
}

const CURRENCIES: { code: CurrencyCode; label: string; symbol: string }[] = [
  { code: "INR", label: "India (INR)", symbol: "₹" },
  { code: "USD", label: "United States (USD)", symbol: "$" },
  { code: "EUR", label: "Europe (EUR)", symbol: "€" },
  { code: "GBP", label: "United Kingdom (GBP)", symbol: "£" },
  { code: "AED", label: "UAE (AED)", symbol: "AED" },
];

interface NavItem {
  id: AppView;
  label: string;
  sublinks: { title: string; desc?: string; view: AppView }[];
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    sublinks: [
      { title: "Overview", desc: "Studio metrics & live pulse", view: "dashboard" },
      { title: "Recent Activity", desc: "Latest invoices & settlements", view: "dashboard" },
      { title: "Revenue Analysis", desc: "Performance & turnover graph", view: "dashboard" },
    ],
  },
  {
    id: "invoices",
    label: "Invoices",
    sublinks: [
      { title: "All Invoices", desc: "Browse full archival ledger", view: "invoices" },
      { title: "Outstanding", desc: "Pending & overdue receivables", view: "invoices" },
      { title: "Settled Ledger", desc: "Verified bank transactions", view: "invoices" },
    ],
  },
  {
    id: "clients",
    label: "Clients",
    sublinks: [
      { title: "Client Directory", desc: "Manage accounts & organizations", view: "clients" },
      { title: "New Client", desc: "Add agency or direct enterprise", view: "clients" },
      { title: "Billing Profiles", desc: "Tax IDs, terms & currency defaults", view: "clients" },
    ],
  },
  {
    id: "services",
    label: "Services",
    sublinks: [
      { title: "Rate Card", desc: "Standard hourly & retainer rates", view: "services" },
      { title: "Deliverable Packages", desc: "Preset scope & production tiers", view: "services" },
      { title: "Catalog Items", desc: "Active service offerings", view: "services" },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    sublinks: [
      { title: "Studio Identity", desc: "Company name, logo & legal entity", view: "settings" },
      { title: "Currency & Region", desc: "Default denomination & formats", view: "settings" },
      { title: "Banking & Payouts", desc: "Bank details & UPI configuration", view: "settings" },
    ],
  },
];

const NOTIFICATIONS = [
  {
    id: "n1",
    title: "Invoice Paid",
    desc: "Siraj Commentary Studio settled INV-1004",
    time: "10m ago",
    unread: true,
  },
  {
    id: "n2",
    title: "Client Added",
    desc: "Apex Media Group linked to active roster",
    time: "1h ago",
    unread: true,
  },
  {
    id: "n3",
    title: "Milestone Verified",
    desc: "Broadcast delivery approved for INV-1002",
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
  const [hoveredNav, setHoveredNav] = useState<NavItem | null>(null);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { user, logout, isAuthenticated } = useAuth();

  const currencyRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setCurrencyDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut Cmd+K or Ctrl+K for search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMobileMenuOpen(false);
        setHoveredNav(null);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 80);
    }
  }, [searchOpen]);

  // Lock body scroll on mobile menu
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        onMouseLeave={() => setHoveredNav(null)}
        className="fixed top-0 left-0 right-0 z-50 w-full h-[44px] bg-[rgba(0,0,0,0.8)] backdrop-blur-[20px] backdrop-saturate-[180%] border-b border-white/[0.08] select-none transition-colors duration-300"
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif',
        }}
      >
        <div className="max-w-[1024px] mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
          
          {/* ==================================================== */}
          {/* 1. APPLE MONOGRAM / LOGO (Left)                      */}
          {/* ==================================================== */}
          <div
            onClick={() => {
              onNavigate("dashboard");
              setMobileMenuOpen(false);
              setSearchOpen(false);
            }}
            className="flex items-center gap-2 cursor-pointer text-white/80 hover:text-white transition-opacity duration-200 flex-shrink-0"
            title="Noir Labs Studio"
          >
            {/* Apple Logo SVG */}
            <svg
              viewBox="0 0 170 170"
              className="w-[15px] h-[15px] fill-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.74-11.64-14.1-5.69-8.91-10.12-18.66-13.3-29.27-3.18-10.6-4.77-20.91-4.77-30.93 0-14.28 3.7-25.96 11.1-35.05 7.4-9.08 16.53-13.68 27.4-13.8 4.79 0 10.07 1.25 15.84 3.76 5.77 2.51 9.4 3.82 10.9 3.92 1.34-.1 5.17-1.46 11.48-4.08 6.31-2.62 11.75-3.87 16.33-3.76 12.39.63 22.42 5.37 30.1 14.22-10.74 6.53-16 15.53-15.77 26.98.24 9.17 3.86 16.89 10.86 23.16 7 6.27 15.34 9.68 25.02 10.23-2.12 6.53-4.78 13.12-7.98 19.78zM119.22 31.84c0-7.72 2.76-14.77 8.28-21.14 5.52-6.38 12.35-10.35 20.48-11.92.21 1.25.32 2.39.32 3.42 0 7.72-2.88 15.02-8.63 21.9-5.75 6.88-12.82 10.82-21.21 11.83-.22-1.35-.33-2.4-.33-3.15z" />
            </svg>
            <span className="text-[12px] font-semibold tracking-tight text-white/90 hidden md:inline-block">
              Noir Labs
            </span>
          </div>

          {/* ==================================================== */}
          {/* 2. CENTER NAVIGATION LINKS (Apple Global Nav Style)  */}
          {/* ==================================================== */}
          <nav className="hidden md:flex items-center justify-center gap-6 lg:gap-8 flex-1 max-w-[680px]">
            {NAV_ITEMS.map((item) => {
              const isActive = currentView === item.id;
              const isHovered = hoveredNav?.id === item.id;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredNav(item)}
                  onClick={() => {
                    onNavigate(item.id);
                    setHoveredNav(null);
                  }}
                  className="relative py-2.5 cursor-pointer"
                >
                  <span
                    className={`text-[12px] tracking-[-0.01em] transition-colors duration-200 ${
                      isActive
                        ? "text-white font-medium"
                        : isHovered
                        ? "text-white"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Active subtle pill / dot indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="appleNavActiveIndicator"
                      className="absolute bottom-[2px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                </div>
              );
            })}
          </nav>

          {/* ==================================================== */}
          {/* 3. RIGHT UTILITIES (Search, Currency, Bell, Sign In) */}
          {/* ==================================================== */}
          <div className="flex items-center gap-3.5 sm:gap-4 flex-shrink-0 text-white/80">
            
            {/* Search Trigger (Apple Magnifying Glass) */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-1 hover:text-white transition-colors cursor-pointer"
              title="Search (⌘K)"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            {/* Currency Selector (Apple Store / Region Pill Style) */}
            <div className="relative" ref={currencyRef}>
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-white/90 hover:text-white text-[11px] font-medium tracking-tight transition-all duration-200 cursor-pointer"
                title="Select Currency"
                aria-label="Currency Selector"
              >
                <span>{currency}</span>
                <span className="text-white/50 text-[10px]">
                  {CURRENCIES.find((c) => c.code === currency)?.symbol}
                </span>
                <ChevronDown className="w-2.5 h-2.5 text-white/60 ml-0.5" />
              </button>

              {/* Apple macOS style popover menu */}
              <AnimatePresence>
                {currencyDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.14 }}
                    className="absolute right-0 mt-2 w-48 rounded-xl shadow-2xl p-1.5 z-50 bg-black/90 backdrop-blur-2xl border border-white/[0.12] text-white"
                  >
                    <div className="px-2.5 py-1 text-[10px] font-semibold text-white/40 uppercase tracking-wider">
                      Currency
                    </div>
                    {CURRENCIES.map((c) => {
                      const selected = currency === c.code;
                      return (
                        <button
                          key={c.code}
                          onClick={() => {
                            onCurrencyChange(c.code);
                            setCurrencyDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[12px] font-normal transition-colors cursor-pointer ${
                            selected
                              ? "bg-white/[0.12] text-white font-medium"
                              : "text-white/70 hover:bg-white/[0.08] hover:text-white"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-white/50 font-mono w-4 text-center">{c.symbol}</span>
                            <span>{c.label}</span>
                          </span>
                          {selected && <Check className="w-3.5 h-3.5 text-white" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications (Apple Bell) */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-1 hover:text-white transition-colors cursor-pointer relative"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-3.5 h-3.5" />
                <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-off-white" />
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.14 }}
                    className="absolute right-0 mt-2 w-72 rounded-2xl shadow-2xl p-3 z-50 bg-black/90 backdrop-blur-2xl border border-white/[0.12] text-white"
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.08]">
                      <span className="text-[12px] font-semibold text-white/90">Notifications</span>
                      <span className="text-[10px] text-white/40">Studio Feed</span>
                    </div>

                    <div className="space-y-2">
                      {NOTIFICATIONS.map((n) => (
                        <div
                          key={n.id}
                          className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.07] transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-medium text-white/90">{n.title}</span>
                            <span className="text-[9px] text-white/40">{n.time}</span>
                          </div>
                          <p className="text-[10px] text-white/60 mt-0.5">{n.desc}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Account / Apple ID Bag Button */}
            {isAuthenticated && user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer"
                  title={user.name}
                >
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-5 h-5 rounded-full border border-white/20 object-cover"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-white/20 text-white text-[10px] font-semibold flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>

                {/* Account Flyout */}
                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.98 }}
                      transition={{ duration: 0.14 }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl p-2.5 z-50 bg-black/90 backdrop-blur-2xl border border-white/[0.12] text-white"
                    >
                      <div className="px-2 py-1.5 mb-1.5 border-b border-white/[0.08]">
                        <p className="text-[12px] font-semibold text-white truncate">{user.name}</p>
                        <p className="text-[10px] text-white/50 truncate">{user.email}</p>
                      </div>

                      <button
                        onClick={() => {
                          onNavigate("settings");
                          setProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] text-white/70 hover:bg-white/[0.08] hover:text-white transition-colors cursor-pointer"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 text-white/60" />
                        <span>Account Settings</span>
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          setProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] text-light-gray hover:bg-graphite/10 hover:text-off-white transition-colors cursor-pointer mt-0.5"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => (window.location.href = "/login.html")}
                className="text-[11px] font-medium tracking-tight px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                Sign In
              </button>
            )}

            {/* Apple 2-Line Animated Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex flex-col justify-center items-center w-6 h-6 gap-[5px] cursor-pointer focus:outline-none"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <span
                className={`w-[17px] h-[1.2px] bg-white rounded-full transition-transform duration-300 ease-out origin-center ${
                  mobileMenuOpen ? "translate-y-[3.1px] rotate-45" : ""
                }`}
              />
              <span
                className={`w-[17px] h-[1.2px] bg-white rounded-full transition-transform duration-300 ease-out origin-center ${
                  mobileMenuOpen ? "-translate-y-[3.1px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* ==================================================== */}
        {/* 4. APPLE FLYOUT MENU (Smooth Desktop Dropdown Panel) */}
        {/* ==================================================== */}
        <AnimatePresence>
          {hoveredNav && !searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="hidden md:block w-full bg-[rgba(0,0,0,0.85)] backdrop-blur-[30px] border-b border-white/[0.08] overflow-hidden"
              onMouseEnter={() => setHoveredNav(hoveredNav)}
              onMouseLeave={() => setHoveredNav(null)}
            >
              <div className="max-w-[1024px] mx-auto px-6 py-8">
                <div className="text-[11px] font-medium text-white/40 tracking-wider uppercase mb-3">
                  Explore {hoveredNav.label}
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {hoveredNav.sublinks.map((link, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        onNavigate(link.view);
                        setHoveredNav(null);
                      }}
                      className="group p-3 rounded-xl hover:bg-white/[0.06] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5 text-[15px] font-semibold text-white/90 group-hover:text-white transition-colors">
                        <span>{link.title}</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-white/50" />
                      </div>
                      {link.desc && (
                        <p className="text-[12px] text-white/50 mt-1 line-clamp-1">{link.desc}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ==================================================== */}
      {/* 5. APPLE SEARCH OVERLAY MODAL (Cmd + K)              */}
      {/* ==================================================== */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xl flex flex-col items-center pt-24 px-4"
          >
            <div className="w-full max-w-[640px] bg-black rounded-2xl border border-white/[0.12] p-4 shadow-2xl">
              <div className="flex items-center gap-3 pb-3 border-b border-white/[0.08]">
                <Search className="w-4 h-4 text-white/40" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search invoices, clients, services, or settings..."
                  className="flex-1 bg-transparent text-white text-[15px] outline-none placeholder:text-white/30"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-1 text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Jump Links */}
              <div className="pt-3">
                <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">
                  Quick Links
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {NAV_ITEMS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setSearchOpen(false);
                      }}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.06] text-white/80 hover:text-white text-[13px] text-left transition-colors cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-off-white" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* 6. APPLE MOBILE DRAWER (Full Page Slide Down)        */}
      {/* ==================================================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 top-[44px] z-40 bg-[rgba(0,0,0,0.96)] backdrop-blur-[35px] flex flex-col justify-between px-8 py-8 md:hidden overflow-y-auto"
            style={{
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
            }}
          >
            {/* Nav list with Apple typography */}
            <div className="space-y-4">
              {NAV_ITEMS.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * idx, duration: 0.2 }}
                >
                  <button
                    onClick={() => {
                      onNavigate(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-[24px] font-semibold tracking-tight text-left w-full transition-colors cursor-pointer ${
                      currentView === item.id ? "text-white" : "text-white/60 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Bottom Utilities in Mobile Drawer */}
            <div className="pt-8 border-t border-white/[0.1] space-y-4">
              <div className="flex items-center justify-between text-white/70 text-[13px]">
                <span>Active Currency</span>
                <span className="font-semibold text-white">{currency}</span>
              </div>

              {isAuthenticated && user ? (
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    {user.picture ? (
                      <img src={user.picture} alt={user.name} className="w-7 h-7 rounded-full" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-semibold text-white">{user.name}</p>
                      <p className="text-[10px] text-white/50">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-light-gray font-medium cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.location.href = "/login.html";
                  }}
                  className="w-full py-2.5 rounded-xl bg-white text-black font-semibold text-xs tracking-tight text-center cursor-pointer shadow-lg"
                >
                  Sign in with Google
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
