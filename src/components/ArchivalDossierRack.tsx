import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Folder,
  FolderOpen,
  FileText,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Shield,
  Cpu,
  Zap,
  Globe,
  Lock,
  Download,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Layers,
  Search,
  Maximize2,
  Sliders,
  DollarSign,
  QrCode,
  Users,
  Database,
  Bot,
} from 'lucide-react';
import { Invoice, CurrencyCode } from '@/types';
import { calculateInvoice } from '@/lib/calc';
import { formatCurrency } from '@/lib/utils';
import { AppView } from './AppShell';
import { Button } from '@/components/ui/button';

export interface DossierFolder {
  id: string;
  index: number;
  code: string;
  tabLabel: string;
  title: string;
  subtitle: string;
  category: string;
  securityLevel: string;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  glowColor: string;
  rangeStartPct: number;
  rangeEndPct: number;
  centerPct: number;
  description: string;
  keyFeatures: string[];
  suggestedActionLabel: string;
  actionType: 'create_invoice' | 'view_invoices' | 'view_clients' | 'view_settings' | 'export_backup' | 'filter_status';
  actionTarget?: string;
  technicalSpecs: {
    protocol: string;
    encryption: string;
    retention: string;
    lifecycle: string;
  };
}

export const DOSSIER_FOLDERS: DossierFolder[] = [
  {
    id: 'dossier-01',
    index: 1,
    code: 'DATA CYCLE_11-15',
    tabLabel: 'ARCHIVE LOG',
    title: 'Data Cycle 11-15 // Archive Log',
    subtitle: 'Historical Settlement Epochs & Fiscal Audits',
    category: 'Historical Ledger',
    securityLevel: 'CLASS-A ARCHIVAL',
    accentColor: '#8E8A7F',
    accentBg: 'rgba(142, 138, 127, 0.15)',
    accentBorder: 'rgba(142, 138, 127, 0.35)',
    glowColor: 'rgba(142, 138, 127, 0.4)',
    rangeStartPct: 0.0,
    rangeEndPct: 9.5,
    centerPct: 4.5,
    description:
      'Archival ledger tracking closed fiscal quarters, historical billing cycles, settled enterprise dockets, and consolidated tax documentation.',
    keyFeatures: [
      'Multi-cycle fiscal ledger archiving',
      'Immutable past invoice timestamp records',
      'Year-to-date gross volume reconciliation',
      'Zero-loss offline backup compatibility',
    ],
    suggestedActionLabel: 'View Archived Invoices',
    actionType: 'view_invoices',
    technicalSpecs: {
      protocol: 'FLUX-PROTOCOL // 03-B',
      encryption: 'SHA-256 CHECKSUM',
      retention: 'PERPETUAL ARCHIVE',
      lifecycle: 'FINALIZED & SETTLED',
    },
  },
  {
    id: 'dossier-02',
    index: 2,
    code: 'CODE_03B // REVISION',
    tabLabel: 'PROTOCOL 03-B',
    title: 'Protocol 03-B // System Audit Log',
    subtitle: 'Document Versioning & Timestamp Revisions',
    category: 'Audit & Compliance',
    securityLevel: 'CLASS-A AUDIT',
    accentColor: '#D0C5AF',
    accentBg: 'rgba(208, 197, 175, 0.15)',
    accentBorder: 'rgba(208, 197, 175, 0.35)',
    glowColor: 'rgba(208, 197, 175, 0.4)',
    rangeStartPct: 9.5,
    rangeEndPct: 18.5,
    centerPct: 14.0,
    description:
      'Granular audit trail detailing timestamped PDF generation, itemized revision passes, client contact amendments, and price schedule updates.',
    keyFeatures: [
      'Granular revision change tracking',
      'Client contact amendment logs',
      'Client-side PDF compilation logs',
      'Sequential invoice numbering validation',
    ],
    suggestedActionLabel: 'Inspect Active Invoices',
    actionType: 'view_invoices',
    technicalSpecs: {
      protocol: 'STUDIES-NET // 01-A',
      encryption: 'RFC-3161 TIMESTAMP',
      retention: '36 MONTHS MINIMUM',
      lifecycle: 'ACTIVE SURVEILLANCE',
    },
  },
  {
    id: 'dossier-03',
    index: 3,
    code: 'CODE_011 // DRIFT',
    tabLabel: 'DRIFT LOG',
    title: 'Code 011 // Drift & Variance Register',
    subtitle: 'Discount Matrices, Tax Variance & Adjustments',
    category: 'Pricing & Variance',
    securityLevel: 'RESTRICTED COMPLIANCE',
    accentColor: '#E8D9C2',
    accentBg: 'rgba(232, 217, 194, 0.15)',
    accentBorder: 'rgba(232, 217, 194, 0.35)',
    glowColor: 'rgba(232, 217, 194, 0.4)',
    rangeStartPct: 18.5,
    rangeEndPct: 27.0,
    centerPct: 22.5,
    description:
      'Financial variance register monitoring custom client discounts, currency conversion drift, rounding offsets, and seasonal promotion adjustments.',
    keyFeatures: [
      'Line-item rate deviation tracking',
      'Client-tier custom discount schedules',
      'Multi-currency exchange rate fluctuation buffer',
      'Real-time tax calculation rounding guards',
    ],
    suggestedActionLabel: 'Configure Tax & Defaults',
    actionType: 'view_settings',
    technicalSpecs: {
      protocol: 'MODULATION 11-B',
      encryption: 'AES-128 FINANCIAL',
      retention: 'ROLLING 12 MONTHS',
      lifecycle: 'ACTIVE MONITORING',
    },
  },
  {
    id: 'dossier-04',
    index: 4,
    code: 'NET_004 // DISPATCH',
    tabLabel: 'NETWORK LOG',
    title: 'Network Log // Propagate & Dispatch',
    subtitle: 'Client Communications & Invoice Distribution',
    category: 'Distribution Channel',
    securityLevel: 'PUBLIC SECURE',
    accentColor: '#F4E7C8',
    accentBg: 'rgba(244, 231, 200, 0.15)',
    accentBorder: 'rgba(244, 231, 200, 0.35)',
    glowColor: 'rgba(244, 231, 200, 0.4)',
    rangeStartPct: 27.0,
    rangeEndPct: 40.0,
    centerPct: 33.5,
    description:
      'Outbound transmission docket recording generated invoices, payment links dispatched, client viewing confirmations, and reminder triggers.',
    keyFeatures: [
      'Client email and portal dispatch history',
      'Dynamic PDF shareable link generator',
      'One-tap payment link copy and delivery',
      'Client communication timestamp logging',
    ],
    suggestedActionLabel: 'Open Client Directory',
    actionType: 'view_clients',
    technicalSpecs: {
      protocol: 'PROPAGATE_ADAPT_FWD',
      encryption: 'TLS 1.3 / E2E',
      retention: 'SYNCHRONIZED REALTIME',
      lifecycle: 'DISPATCH READY',
    },
  },
  {
    id: 'dossier-05',
    index: 5,
    code: 'CODE_012 // VOID',
    tabLabel: 'VOID PLIES',
    title: 'Code 012 // Void Dockets & Exceptions',
    subtitle: 'Cancellations, Reversals & Credit Notes',
    category: 'Reconciliation',
    securityLevel: 'SUPERVISOR CLEARANCE',
    accentColor: '#626973',
    accentBg: 'rgba(98, 105, 115, 0.15)',
    accentBorder: 'rgba(98, 105, 115, 0.35)',
    glowColor: 'rgba(98, 105, 115, 0.4)',
    rangeStartPct: 40.0,
    rangeEndPct: 47.5,
    centerPct: 43.5,
    description:
      'Official register managing cancelled billing dockets, disputed line items, overdue collection warnings, and compensating credit notes.',
    keyFeatures: [
      'Zero-destructive cancellation records',
      'Overdue aging buckets and warnings',
      'Dispute resolution status markers',
      'Automated reconciliation notes',
    ],
    suggestedActionLabel: 'Review Pending Invoices',
    actionType: 'filter_status',
    actionTarget: 'pending',
    technicalSpecs: {
      protocol: 'VOID-PLIES-SYS',
      encryption: 'AUDITED ENCLAVE',
      retention: 'INDEFINITE LEGAL',
      lifecycle: 'EXCEPTION STATE',
    },
  },
  {
    id: 'dossier-06',
    index: 6,
    code: 'TX_006 // DATA LINK',
    tabLabel: 'TRANSMIT',
    title: 'Transmit // Data Link & Instant UPI',
    subtitle: 'Zero-Fee Dynamic UPI QR Codes & Fast Settlements',
    category: 'Settlement Engine',
    securityLevel: 'CRYPTOGRAPHIC REALTIME',
    accentColor: '#E5A83B',
    accentBg: 'rgba(229, 168, 59, 0.15)',
    accentBorder: 'rgba(229, 168, 59, 0.45)',
    glowColor: 'rgba(229, 168, 59, 0.5)',
    rangeStartPct: 47.5,
    rangeEndPct: 59.0,
    centerPct: 53.0,
    description:
      'Direct cryptographic payment gateway pipeline routing real-time UPI QR scan-and-pay transactions, bank VPA routing, and instant mobile receipts.',
    keyFeatures: [
      'Instant UPI dynamic QR code generation',
      'Supported by GPay, PhonePe, Paytm, BHIM, Cred',
      'Automated invoice amount & VPA parameter encoding',
      'Zero-gateway-fee instant direct settlements',
    ],
    suggestedActionLabel: 'Configure UPI Payment Settings',
    actionType: 'view_settings',
    technicalSpecs: {
      protocol: 'UPI-DEEP-LINK // NPCI',
      encryption: '256-BIT FINANCIAL',
      retention: 'EPHEMERAL & PERSISTENT',
      lifecycle: 'LIVE TRANSMISSION',
    },
  },
  {
    id: 'dossier-07',
    index: 7,
    code: 'RT_007 // ROUTE',
    tabLabel: 'ROUTE',
    title: 'Route // Jurisdictions & Tax Matrix',
    subtitle: 'GST, VAT & Multi-Currency Routing Matrix',
    category: 'Tax & Multi-Currency',
    securityLevel: 'COMPLIANCE GOVERNANCE',
    accentColor: '#9E7853',
    accentBg: 'rgba(158, 120, 83, 0.15)',
    accentBorder: 'rgba(158, 120, 83, 0.35)',
    glowColor: 'rgba(158, 120, 83, 0.4)',
    rangeStartPct: 59.0,
    rangeEndPct: 66.0,
    centerPct: 62.5,
    description:
      'Tax jurisdiction routing matrix governing local GST/VAT percentages, cross-border invoicing compliance, and international multi-currency ledgers.',
    keyFeatures: [
      'Multi-currency ledger: INR (₹), USD ($), EUR (€), GBP (£), AED (د.إ)',
      'Automated GST / Tax rate calculation cascade',
      'Standardized international business identifiers',
      'Shipping, duties, and surcharge routing logic',
    ],
    suggestedActionLabel: 'Review Currency Settings',
    actionType: 'view_settings',
    technicalSpecs: {
      protocol: 'ISO-4217 ROUTER',
      encryption: 'STATUTORY VALIDATION',
      retention: 'ANNUAL TAX FISCAL',
      lifecycle: 'ACTIVE PROTOCOL',
    },
  },
  {
    id: 'dossier-08',
    index: 8,
    code: 'CX_008 // ENTERPRISE',
    tabLabel: '⚛ CX',
    title: 'CX // VIP Accounts & Enterprise Retainers',
    subtitle: 'High-Value Agency Clients & Retainer Contracts',
    category: 'Client Relationship',
    securityLevel: 'EXECUTIVE VIP',
    accentColor: '#E85D3F',
    accentBg: 'rgba(232, 93, 63, 0.15)',
    accentBorder: 'rgba(232, 93, 63, 0.45)',
    glowColor: 'rgba(232, 93, 63, 0.5)',
    rangeStartPct: 66.0,
    rangeEndPct: 77.5,
    centerPct: 72.0,
    description:
      'Dedicated high-priority repository managing enterprise SLA contracts, long-term agency retainers, volume discounts, and VIP client profiles.',
    keyFeatures: [
      'Tiered VIP client relationship profiling',
      'Recurring monthly retainer contract management',
      'Dedicated project scopes & milestone tracking',
      'Priority payment terms and automated alerts',
    ],
    suggestedActionLabel: 'Manage VIP Clients',
    actionType: 'view_clients',
    technicalSpecs: {
      protocol: 'ATOM-CX // ENTERPRISE',
      encryption: 'ENTERPRISE VAULT',
      retention: 'CONTRACT PERIOD',
      lifecycle: 'TOP PRIORITY',
    },
  },
  {
    id: 'dossier-09',
    index: 9,
    code: 'SEC_009 // ENCRYPT',
    tabLabel: 'OFFLINE',
    title: 'Offline // Sovereign Encrypted Vault',
    subtitle: 'Zero-Cloud Local Storage & Cryptographic Privacy',
    category: 'Data Sovereignty',
    securityLevel: 'AIR-GAPPED LOCAL',
    accentColor: '#F5F5F7',
    accentBg: 'rgba(245, 245, 247, 0.12)',
    accentBorder: 'rgba(245, 245, 247, 0.35)',
    glowColor: 'rgba(245, 245, 247, 0.4)',
    rangeStartPct: 77.5,
    rangeEndPct: 86.5,
    centerPct: 82.0,
    description:
      'Local client-side encrypted vault ensuring 100% data sovereignty, air-gapped security, zero unauthorized cloud tracking, and complete JSON backups.',
    keyFeatures: [
      '100% client-side local database storage',
      'Zero external database leakage or unauthorized tracking',
      'One-click full JSON database export and backup',
      'Offline-first architecture resilient to network dropouts',
    ],
    suggestedActionLabel: 'Download Full JSON Backup',
    actionType: 'export_backup',
    technicalSpecs: {
      protocol: 'LOCALSTORAGE-VAULT',
      encryption: 'DEVICE-BOUND CIPHER',
      retention: 'USER CONTROLLED',
      lifecycle: 'AIR-GAPPED SECURE',
    },
  },
  {
    id: 'dossier-10',
    index: 10,
    code: 'BIO_010 // ORCRYPT',
    tabLabel: 'ORCRYPT',
    title: 'Orcrypt // Autonomous AI & Smart Drafting',
    subtitle: 'Google Gemini GenAI Synthesis & Smart Workflows',
    category: 'AI Autonomous',
    securityLevel: 'NEURAL AUGMENTED',
    accentColor: '#10B981',
    accentBg: 'rgba(16, 185, 129, 0.15)',
    accentBorder: 'rgba(16, 185, 129, 0.45)',
    glowColor: 'rgba(16, 185, 129, 0.5)',
    rangeStartPct: 86.5,
    rangeEndPct: 100.0,
    centerPct: 93.5,
    description:
      'Next-generation autonomous invoice drafting engine combining Google Gemini AI natural language synthesis with recurring billing schedules.',
    keyFeatures: [
      'Google Gemini AI conversational invoice drafting',
      'Automatic deliverables, hourly rates & terms extraction',
      'Biomorphic adaptive layout composition',
      'Instant draft generation from simple natural text',
    ],
    suggestedActionLabel: 'Launch AI Invoice Builder',
    actionType: 'create_invoice',
    technicalSpecs: {
      protocol: 'GEMINI-GENAI-v2.4',
      encryption: 'NEURAL EMBEDDING',
      retention: 'DYNAMIC CACHE',
      lifecycle: 'GENERATIVE EXPANSION',
    },
  },
];

interface ArchivalDossierRackProps {
  invoices: Invoice[];
  currency: CurrencyCode;
  onCreateNew: () => void;
  onNavigate: (view: AppView) => void;
}

export function ArchivalDossierRack({
  invoices,
  currency,
  onCreateNew,
  onNavigate,
}: ArchivalDossierRackProps) {
  const [hoveredFolder, setHoveredFolder] = useState<DossierFolder | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<DossierFolder | null>(null);
  const [viewMode, setViewMode] = useState<'rack' | 'cards'>('rack');

  // Handle keyboard navigation when modal is open
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!selectedFolder) return;
      if (e.key === 'Escape') {
        setSelectedFolder(null);
      } else if (e.key === 'ArrowLeft') {
        const prevIndex = (selectedFolder.index - 2 + DOSSIER_FOLDERS.length) % DOSSIER_FOLDERS.length;
        setSelectedFolder(DOSSIER_FOLDERS[prevIndex]);
      } else if (e.key === 'ArrowRight') {
        const nextIndex = selectedFolder.index % DOSSIER_FOLDERS.length;
        setSelectedFolder(DOSSIER_FOLDERS[nextIndex]);
      }
    },
    [selectedFolder]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Execute folder-specific action
  const handleExecuteAction = (folder: DossierFolder) => {
    setSelectedFolder(null);
    if (folder.actionType === 'create_invoice') {
      onCreateNew();
    } else if (folder.actionType === 'view_invoices') {
      onNavigate('invoices');
    } else if (folder.actionType === 'view_clients') {
      onNavigate('clients');
    } else if (folder.actionType === 'view_settings') {
      onNavigate('settings');
    } else if (folder.actionType === 'filter_status') {
      onNavigate('invoices');
    } else if (folder.actionType === 'export_backup') {
      // Trigger instant JSON export of the entire database
      const exportData = {
        exportedAt: new Date().toISOString(),
        version: '4.2.0',
        invoices: invoices,
        currency: currency,
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `noir-invoice-vault-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Compute live contextual data for selected folder
  const getFolderLiveData = (folder: DossierFolder) => {
    switch (folder.id) {
      case 'dossier-01':
      case 'dossier-02': {
        const totalGrand = invoices.reduce(
          (sum, inv) => sum + calculateInvoice(inv).grandTotal,
          0
        );
        return {
          stat1: { label: 'Archived Documents', val: `${invoices.length} Dockets` },
          stat2: { label: 'Settled Gross Volume', val: formatCurrency(totalGrand, currency) },
          stat3: { label: 'Audit Integrity', val: '100% Validated' },
        };
      }
      case 'dossier-05': {
        const pendingCount = invoices.filter((i) => i.status === 'pending').length;
        const overdueCount = invoices.filter((i) => i.status === 'overdue').length;
        return {
          stat1: { label: 'Pending Settlement', val: `${pendingCount} Invoices` },
          stat2: { label: 'Overdue Dockets', val: `${overdueCount} Alerts` },
          stat3: { label: 'Status Protocol', val: 'Active Sweep' },
        };
      }
      case 'dossier-06': {
        const paidCount = invoices.filter((i) => i.status === 'paid').length;
        return {
          stat1: { label: 'Settlement Protocol', val: 'Direct UPI 2.0' },
          stat2: { label: 'Settled Transactions', val: `${paidCount} Completed` },
          stat3: { label: 'Gateway Fee', val: '0.00% Zero-Loss' },
        };
      }
      case 'dossier-07': {
        return {
          stat1: { label: 'Active Currency', val: `${currency} Sovereign` },
          stat2: { label: 'Jurisdiction Rate', val: '18% GST / Dynamic' },
          stat3: { label: 'Supported Currencies', val: 'INR, USD, EUR, GBP, AED' },
        };
      }
      case 'dossier-08': {
        const enterpriseInvoices = invoices.filter(
          (i) => calculateInvoice(i).grandTotal > 50000
        );
        return {
          stat1: { label: 'VIP Priority Accounts', val: 'High-Tier Active' },
          stat2: { label: 'Major Retainers (>₹50k)', val: `${enterpriseInvoices.length} Contracts` },
          stat3: { label: 'SLA Level', val: 'Class-1 Enterprise' },
        };
      }
      case 'dossier-09': {
        const estimatedStorage = JSON.stringify(invoices).length;
        return {
          stat1: { label: 'Storage Enclave', val: 'Local Browser Vault' },
          stat2: { label: 'Encrypted Payload', val: `${(estimatedStorage / 1024).toFixed(1)} KB` },
          stat3: { label: 'Cloud Leakage', val: '0% Air-Gapped' },
        };
      }
      case 'dossier-10': {
        return {
          stat1: { label: 'AI Model Engine', val: 'Gemini 2.4 Flash' },
          stat2: { label: 'Drafting Latency', val: '~850 ms' },
          stat3: { label: 'Natural Language Scope', val: 'Ready & Enabled' },
        };
      }
      default:
        return {
          stat1: { label: 'Active Registry', val: 'Synchronized' },
          stat2: { label: 'Security Clearance', val: folder.securityLevel },
          stat3: { label: 'Protocol ID', val: folder.code },
        };
    }
  };

  return (
    <section className="relative w-full space-y-6 pt-2">
      {/* Section Header with Architectural Coordinates */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#F4E7C8]/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-[#F4E7C8]/15 text-xs font-semibold text-[#F4E7C8] mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E85D3F] animate-pulse" />
            <span className="tracking-widest uppercase text-[10px] font-mono">
              SEC_02 // SYSTEM VAULT & DOSSIER REGISTRIES
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-extrabold tracking-tight text-[#F4E7C8]">
            Active Financial Dossiers & Ledger Archives
          </h2>
          <p className="text-xs sm:text-sm text-[#D8CBB7] mt-1 max-w-2xl font-light">
            Interactive physical filing index inspired by Noir architectural archives. Hover across folders to inspect designations; click any dossier to unseal its contents.
          </p>
        </div>

        {/* View Toggle & Count Pill */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 border border-[#F4E7C8]/15 text-[11px] font-mono text-[#D8CBB7]">
            <Layers className="w-3.5 h-3.5 text-[#E85D3F]" />
            <span>10 Active Dockets</span>
          </div>

          <div className="inline-flex rounded-lg p-0.5 bg-black/50 border border-white/10">
            <button
              onClick={() => setViewMode('rack')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'rack'
                  ? 'bg-[#E85D3F] text-white shadow-md'
                  : 'text-[#D8CBB7] hover:text-white'
              }`}
            >
              Panoramic Rack
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'cards'
                  ? 'bg-[#E85D3F] text-white shadow-md'
                  : 'text-[#D8CBB7] hover:text-white'
              }`}
            >
              Dossier Cards
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: PANORAMIC RACK WITH INTERACTIVE HOVER COLUMNS */}
      {viewMode === 'rack' && (
        <div className="relative w-full overflow-hidden bg-transparent group/rack border-y border-[#F4E7C8]/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          
          {/* Technical Top Coordinate Bar */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex items-center justify-between px-3 py-1.5 mt-4 mb-4 rounded-xl bg-black/60 border border-white/5 text-[10px] font-mono text-[#D8CBB7]/80 backdrop-blur-sm">
              <div className="flex items-center gap-3 truncate">
                <span className="text-[#E85D3F] font-bold">[ARCHIVE_INDEX // IN_11-15]</span>
                <span className="hidden md:inline">LATENCY: 0.12ms</span>
                <span className="hidden sm:inline">RESOLUTION: 2752x1536</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[#F4E7C8] font-bold uppercase">Hover Folders & Click To Unseal</span>
              </div>
            </div>
          </div>

          {/* Main Visual Frame with Overlay Interactive Columns - Full Width Edge to Edge */}
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-[2752/1200] overflow-hidden bg-black select-none">
            {/* Base Image with Floating 3D and Transparency */}
            <img
              src="/in.jpg"
              alt="Noir Archival Folders Dossier"
              className="w-full h-full object-cover object-center filter contrast-[1.03] brightness-[0.98] transition-all duration-300 animate-float drop-shadow-2xl"
              style={{
                WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
              }}
            />

            {/* Subtle Vignette & Grain */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

            {/* Interactive Folder Columns mapped across percentage widths */}
            <div className="absolute inset-0 flex w-full h-full z-10">
              {DOSSIER_FOLDERS.map((folder) => {
                const widthPct = folder.rangeEndPct - folder.rangeStartPct;
                const isHovered = hoveredFolder?.id === folder.id;

                return (
                  <div
                    key={folder.id}
                    style={{ width: `${widthPct}%` }}
                    className="relative h-full cursor-pointer transition-all duration-200 group/col"
                    onMouseEnter={() => setHoveredFolder(folder)}
                    onMouseLeave={() => setHoveredFolder(null)}
                    onClick={() => setSelectedFolder(folder)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Inspect ${folder.title}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedFolder(folder);
                      }
                    }}
                  >
                    {/* Hover Glow & Lift Effect */}
                    <div
                      className={`absolute inset-0 transition-all duration-250 ${
                        isHovered
                          ? 'opacity-100 backdrop-brightness-110 shadow-[0_0_35px_rgba(232,93,63,0.35)_inset]'
                          : 'opacity-0 hover:opacity-40'
                      }`}
                      style={{
                        backgroundColor: folder.accentBg,
                        borderLeft: `1px solid ${folder.accentBorder}`,
                        borderRight: `1px solid ${folder.accentBorder}`,
                      }}
                    />

                    {/* Top Tab Marker Pin */}
                    <div
                      className={`absolute top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-mono font-bold tracking-tighter whitespace-nowrap transition-all duration-200 ${
                        isHovered
                          ? 'opacity-100 scale-105 bg-black text-[#F4E7C8] border shadow-lg'
                          : 'opacity-0 sm:opacity-50 text-white/70 bg-black/60'
                      }`}
                      style={{ borderColor: folder.accentColor }}
                    >
                      {folder.tabLabel}
                    </div>

                    {/* Hover Center Indicator */}
                    {isHovered && (
                      <motion.div
                        layoutId="activeFolderHalo"
                        className="absolute inset-x-1 bottom-4 py-2 px-1.5 rounded-lg bg-black/85 backdrop-blur-md border border-white/20 text-center shadow-2xl z-30"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                      >
                        <div
                          className="text-[9px] sm:text-[10px] font-mono font-extrabold uppercase truncate"
                          style={{ color: folder.accentColor }}
                        >
                          {folder.code}
                        </div>
                        <div className="text-[10px] sm:text-xs font-bold text-[#F4E7C8] truncate">
                          {folder.tabLabel}
                        </div>
                        <div className="text-[8px] text-[#D8CBB7]/80 truncate mt-0.5">
                          Click to Unseal ↗
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-time Dynamic Dossier Inspector Footer Bar */}
          <div className="mt-3 px-3 py-2.5 rounded-xl bg-black/60 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border transition-colors"
                style={{
                  backgroundColor: hoveredFolder?.accentBg || 'rgba(232, 93, 63, 0.15)',
                  borderColor: hoveredFolder?.accentBorder || 'rgba(232, 93, 63, 0.3)',
                  color: hoveredFolder?.accentColor || '#E85D3F',
                }}
              >
                {hoveredFolder ? (
                  <FolderOpen className="w-4 h-4" />
                ) : (
                  <Folder className="w-4 h-4" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-[#E85D3F]">
                    {hoveredFolder
                      ? `[DOCKET ${hoveredFolder.index.toString().padStart(2, '0')}/10]`
                      : '[EXPLORE DOSSIERS]'}
                  </span>
                  <span className="font-heading font-bold text-[#F4E7C8] truncate">
                    {hoveredFolder ? hoveredFolder.title : 'Sweep cursor over folders to inspect'}
                  </span>
                </div>
                <p className="text-[11px] text-[#D8CBB7] truncate font-light">
                  {hoveredFolder
                    ? hoveredFolder.subtitle
                    : 'Each docket corresponds to active ledger functions, UPI routing, enterprise accounts & local cryptographic vaults.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
              {hoveredFolder ? (
                <button
                  onClick={() => setSelectedFolder(hoveredFolder)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-black flex items-center gap-1.5 transition-all shadow-md hover:scale-105"
                  style={{ backgroundColor: hoveredFolder.accentColor }}
                >
                  <span>Unseal Dossier #{hoveredFolder.index}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="text-[11px] font-mono text-[#D8CBB7]/60">
                  Tap or click any folder to pop up
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: TACTILE DOSSIER CARDS GRID */}
      {viewMode === 'cards' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {DOSSIER_FOLDERS.map((folder) => {
              const isHovered = hoveredFolder?.id === folder.id;

              return (
              <motion.div
                key={folder.id}
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={() => setSelectedFolder(folder)}
                onMouseEnter={() => setHoveredFolder(folder)}
                onMouseLeave={() => setHoveredFolder(null)}
                className="group relative rounded-xl overflow-hidden border bg-[#111113] p-3 cursor-pointer shadow-lg transition-all flex flex-col justify-between h-[210px]"
                style={{
                  borderColor: isHovered ? folder.accentColor : 'rgba(244, 231, 200, 0.1)',
                }}
              >
                {/* Background Specimen Slice from in.jpg */}
                <div
                  className="absolute inset-0 opacity-25 group-hover:opacity-40 transition-opacity bg-cover"
                  style={{
                    backgroundImage: 'url(/in.jpg)',
                    backgroundPosition: `${folder.centerPct}% center`,
                    backgroundSize: '1000% 100%',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-[#0B0B0C]/80 to-transparent" />

                {/* Card Top Pill */}
                <div className="relative z-10 flex items-center justify-between">
                  <span
                    className="px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-tight text-black"
                    style={{ backgroundColor: folder.accentColor }}
                  >
                    #{folder.index.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[9px] font-mono text-[#D8CBB7]/80 truncate">
                    {folder.tabLabel}
                  </span>
                </div>

                {/* Card Center Info */}
                <div className="relative z-10 space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#E85D3F]">
                    {folder.category}
                  </div>
                  <h3 className="font-heading font-extrabold text-sm text-[#F4E7C8] leading-snug line-clamp-2">
                    {folder.title}
                  </h3>
                  <p className="text-[10px] text-[#D8CBB7] line-clamp-2 font-light">
                    {folder.subtitle}
                  </p>
                </div>

                {/* Card Bottom Action */}
                <div className="relative z-10 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-semibold text-[#F4E7C8] group-hover:text-white">
                  <span>Pop Up Docket</span>
                  <ArrowRight className="w-3 h-3 text-[#E85D3F] group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
          </div>
        </div>
      )}

      {/* POP-UP MODAL // INTERACTIVE DOSSIER UNSEAL INSPECTION DIALOG */}
      <AnimatePresence>
        {selectedFolder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFolder(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-xl transition-all"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0D0D0E] border shadow-2xl p-5 sm:p-8 z-10 space-y-6"
              style={{
                borderColor: selectedFolder.accentBorder,
                boxShadow: `0 20px 60px ${selectedFolder.glowColor}`,
              }}
            >
              {/* Corner Framing Elements */}
              <div
                className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 pointer-events-none"
                style={{ borderColor: selectedFolder.accentColor }}
              />
              <div
                className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 pointer-events-none"
                style={{ borderColor: selectedFolder.accentColor }}
              />
              <div
                className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 pointer-events-none"
                style={{ borderColor: selectedFolder.accentColor }}
              />
              <div
                className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 pointer-events-none"
                style={{ borderColor: selectedFolder.accentColor }}
              />

              {/* Top Modal Navigation & Close Header */}
              <div className="flex items-start justify-between gap-4 border-b border-[#F4E7C8]/10 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="px-2.5 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase text-black"
                      style={{ backgroundColor: selectedFolder.accentColor }}
                    >
                      DOCKET #{selectedFolder.index.toString().padStart(2, '0')} // 10
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-white/[0.06] border border-white/10 text-[10px] font-mono text-[#D8CBB7]">
                      {selectedFolder.securityLevel}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      SYNCHRONIZED
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-black text-[#F4E7C8] tracking-tight pt-1">
                    {selectedFolder.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#D8CBB7] font-light">
                    {selectedFolder.subtitle}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedFolder(null)}
                  className="p-2 rounded-xl bg-white/[0.05] border border-[#F4E7C8]/20 hover:bg-white/10 text-[#D8CBB7] hover:text-white transition-colors flex-shrink-0"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 2-Column Split Content */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Focused Specimen Artifact from in.jpg */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black aspect-[3/4] max-h-[380px] shadow-inner group">
                    {/* High-res isolated slice centered on this folder */}
                    <div
                      className="w-full h-full bg-cover transition-transform duration-500 group-hover:scale-105"
                      style={{
                        backgroundImage: 'url(/in.jpg)',
                        backgroundPosition: `${selectedFolder.centerPct}% center`,
                        backgroundSize: '1000% 100%',
                      }}
                    />

                    {/* Specimen Badge Overlay */}
                    <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/80 backdrop-blur-md border border-white/15 text-[9px] font-mono text-[#F4E7C8]">
                      SPECIMEN CROP // {selectedFolder.code}
                    </div>

                    <div className="absolute bottom-3 inset-x-3 p-2 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-center">
                      <span className="text-[10px] font-mono text-[#D8CBB7]">
                        ORIGINAL HIGH-RES ARCHIVE REGISTER
                      </span>
                    </div>
                  </div>

                  {/* Technical Specifications Matrix */}
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2 text-[11px] font-mono">
                    <div className="flex justify-between text-[#D8CBB7]">
                      <span>PROTOCOL ID:</span>
                      <span className="text-[#F4E7C8] font-bold">
                        {selectedFolder.technicalSpecs.protocol}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#D8CBB7]">
                      <span>ENCRYPTION:</span>
                      <span className="text-[#F4E7C8]">
                        {selectedFolder.technicalSpecs.encryption}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#D8CBB7]">
                      <span>RETENTION:</span>
                      <span className="text-[#F4E7C8]">
                        {selectedFolder.technicalSpecs.retention}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#D8CBB7]">
                      <span>LIFECYCLE:</span>
                      <span className="text-emerald-400 font-bold">
                        {selectedFolder.technicalSpecs.lifecycle}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Docket Details & Interactive App Linkage */}
                <div className="lg:col-span-7 space-y-5">
                  {/* Detailed Description */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-[#E85D3F]">
                      // ARCHIVAL MANDATE & OPERATIONAL SCOPE
                    </h3>
                    <p className="text-xs sm:text-sm text-[#F4E7C8]/90 leading-relaxed font-light">
                      {selectedFolder.description}
                    </p>
                  </div>

                  {/* Key Capabilities Bullet Points */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-[#D8CBB7]">
                      Key System Capabilities:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedFolder.keyFeatures.map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-[#D8CBB7]"
                        >
                          <CheckCircle2
                            className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                            style={{ color: selectedFolder.accentColor }}
                          />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Live Connected App Data Cards */}
                  <div className="p-3.5 rounded-2xl bg-black/60 border border-[#F4E7C8]/15 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#E85D3F]">
                        Live System Telemetry
                      </span>
                      <span className="text-[10px] font-mono text-[#D8CBB7]">
                        SYNCED WITH CURRENT STATE
                      </span>
                    </div>

                    {(() => {
                      const data = getFolderLiveData(selectedFolder);
                      return (
                        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                            <div className="text-[10px] text-[#D8CBB7] truncate">
                              {data.stat1.label}
                            </div>
                            <div className="text-xs sm:text-sm font-heading font-black text-[#F4E7C8] truncate mt-0.5">
                              {data.stat1.val}
                            </div>
                          </div>
                          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                            <div className="text-[10px] text-[#D8CBB7] truncate">
                              {data.stat2.label}
                            </div>
                            <div className="text-xs sm:text-sm font-heading font-black text-[#E85D3F] truncate mt-0.5">
                              {data.stat2.val}
                            </div>
                          </div>
                          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                            <div className="text-[10px] text-[#D8CBB7] truncate">
                              {data.stat3.label}
                            </div>
                            <div className="text-xs sm:text-sm font-heading font-black text-emerald-300 truncate mt-0.5">
                              {data.stat3.val}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <Button
                      onClick={() => handleExecuteAction(selectedFolder)}
                      size="lg"
                      className="w-full sm:w-auto font-heading font-bold shadow-xl"
                      style={{
                        backgroundColor: selectedFolder.accentColor,
                        color: selectedFolder.accentColor === '#F5F5F7' ? '#000000' : '#FFFFFF',
                      }}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{selectedFolder.suggestedActionLabel}</span>
                    </Button>

                    <Button
                      onClick={() => setSelectedFolder(null)}
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      <span>Close Dossier</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Bottom Pagination & Sequential Navigation */}
              <div className="pt-4 border-t border-[#F4E7C8]/10 flex items-center justify-between gap-3 text-xs">
                <button
                  onClick={() => {
                    const prevIndex =
                      (selectedFolder.index - 2 + DOSSIER_FOLDERS.length) % DOSSIER_FOLDERS.length;
                    setSelectedFolder(DOSSIER_FOLDERS[prevIndex]);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 hover:bg-white/10 text-[#D8CBB7] hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous Docket</span>
                </button>

                {/* 10 Folder Quick Dots */}
                <div className="flex items-center gap-1.5">
                  {DOSSIER_FOLDERS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFolder(f)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        f.id === selectedFolder.id
                          ? 'scale-125 ring-2 ring-white/50'
                          : 'opacity-40 hover:opacity-80'
                      }`}
                      style={{ backgroundColor: f.accentColor }}
                      title={`Jump to ${f.title}`}
                      aria-label={`Jump to ${f.title}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => {
                    const nextIndex = selectedFolder.index % DOSSIER_FOLDERS.length;
                    setSelectedFolder(DOSSIER_FOLDERS[nextIndex]);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 hover:bg-white/10 text-[#D8CBB7] hover:text-white transition-colors"
                >
                  <span className="hidden sm:inline">Next Docket</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
