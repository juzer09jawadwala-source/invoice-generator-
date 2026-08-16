export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue';
export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED';

export interface CatalogService {
  id: string;
  name: string;
  category: string;
  price: number;
  taxPercent: number;
  description: string;
}

/** One editable row in the invoice items table. */
export interface LineItem {
  id: string;
  serviceId: string | null;   // null => custom / free-text
  name: string;
  description: string;
  quantity: number;
  rate: number;
  discountPercent: number;    // 0–100, per line
  taxPercent: number;         // 0–100, per line
}

export interface Client {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  createdAt: number;
}

export interface AppSettings {
  company: CompanyDetails;
  defaultCurrency: CurrencyCode;
  defaultTaxRate: number;
  defaultTerms: string[];
}

export interface PackageItem {
  id: string;
  name: string;
  price: number;
  isCustomPrice?: boolean;
}

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  selected: boolean;
}

export interface PaymentMilestone {
  id: string;
  percentage: number;
  description: string;
}

export interface CompanyDetails {
  name: string;
  phone: string;
  email: string;
  website: string;
  gstNumber: string;
  address: string;
  logoUrl?: string;
}

export interface ClientDetails {
  name: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  logoUrl?: string;
  projectName: string;
}

export interface InvoiceTotals {
  subtotal: number;
  itemDiscounts: number;
  taxableAmount: number;
  taxTotal: number;
  grandTotal: number;
  advancePaid: number;
  balanceDue: number;
  effectiveTaxRate: number;
  lineCalculations: {
    id: string;
    gross: number;
    discount: number;
    net: number;
    taxable: number;
    tax: number;
    total: number;
  }[];
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  status: InvoiceStatus;
  currency: CurrencyCode;
  clientId: string | null;
  company: CompanyDetails;
  client: ClientDetails;
  items: LineItem[];
  // Legacy fields kept for backward compatibility:
  selectedPackage: string | null; // ID of the package
  customPackagePrice: number;
  services: ServiceItem[];
  addons: ServiceItem[];
  discount: number;
  gstPercent: number;
  advancePaid: number;
  paymentSchedule: PaymentMilestone[];
  notes: string;
  terms: string[];
  createdAt: number;
  updatedAt: number;
}
