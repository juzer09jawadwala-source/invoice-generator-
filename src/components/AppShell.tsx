import React from 'react';
import { CurrencyCode } from '../types';
import { EditorialBackground } from './EditorialBackground';
import { InkFrameHeader, AppView } from './InkFrameHeader';
import { KresnaFooter } from './KresnaFooter';

export type { AppView };

interface AppShellProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  currency: CurrencyCode;
  onCurrencyChange: (c: CurrencyCode) => void;
  children: React.ReactNode;
}

export function AppShell({
  currentView,
  onNavigate,
  currency,
  onCurrencyChange,
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen text-[#F4E7C8] font-sans selection:bg-[#E85D3F]/40 selection:text-white relative flex flex-col justify-between">
      {/* Editorial Atmosphere Background */}
      <EditorialBackground />

      {/* Apple Global Navigation Header */}
      <InkFrameHeader
        currentView={currentView}
        onNavigate={onNavigate}
        currency={currency}
        onCurrencyChange={onCurrencyChange}
      />

      {/* Main Content Area - padded to clear 44px fixed Apple header */}
      <main className="relative z-10 flex-grow pt-[44px]">{children}</main>

      {/* Footer for all pages */}
      <KresnaFooter />
    </div>
  );
}
