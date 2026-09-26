import React from 'react';
import { CurrencyCode } from '../types';
import { EditorialBackground } from './EditorialBackground';
import { InkFrameHeader, AppView } from './InkFrameHeader';

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
    <div className="min-h-screen text-[#F4E7C8] font-sans selection:bg-[#E85D3F]/40 selection:text-white relative">
      {/* Editorial Terracotta & Geometric Atmosphere Background */}
      <EditorialBackground />

      {/* Rebuilt Header inspired by Reference Image 1 with Sumi-e Ink Smoke & Inner Architectural Frame */}
      <InkFrameHeader
        currentView={currentView}
        onNavigate={onNavigate}
        currency={currency}
        onCurrencyChange={onCurrencyChange}
      />

      {/* Main Content Area */}
      <main className="relative z-10">{children}</main>
    </div>
  );
}
