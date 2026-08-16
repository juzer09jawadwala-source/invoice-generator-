import { Invoice, LineItem } from '../types';
import { DEFAULT_PACKAGES, DEFAULT_PAYMENT_SCHEDULE, DEFAULT_TERMS } from '../data';

export function migrateInvoice(raw: any): Invoice {
  try {
    if (!raw || typeof raw !== 'object') {
      throw new Error('Invalid invoice object');
    }

    const defaultCompany = {
      name: 'Noir Labs',
      phone: '+91 9167868179',
      email: 'juzer09jawadwala@gmail.com',
      website: 'www.noirlabs.com',
      gstNumber: '',
      address: 'Anjeerwadi, Thakkar estate, Mazgaon Mumbai 400010',
    };

    const defaultClient = {
      name: '',
      companyName: '',
      email: '',
      phone: '',
      address: '',
      projectName: '',
    };

    // If items is already an array and non-empty, ensure all modern fields exist
    if (Array.isArray(raw.items) && raw.items.length > 0) {
      return {
        ...raw,
        status: raw.status || 'pending',
        currency: raw.currency || 'INR',
        clientId: raw.clientId || null,
        company: { ...defaultCompany, ...(raw.company || {}) },
        client: { ...defaultClient, ...(raw.client || {}) },
        items: raw.items.map((item: any) => ({
          id: item.id || crypto.randomUUID(),
          serviceId: item.serviceId || null,
          name: item.name || 'Service',
          description: item.description || '',
          quantity: Number(item.quantity) || 1,
          rate: Number(item.rate) || 0,
          discountPercent: Number(item.discountPercent) || 0,
          taxPercent: Number(item.taxPercent) !== undefined ? Number(item.taxPercent) : 18,
        })),
        services: Array.isArray(raw.services) ? raw.services : [],
        addons: Array.isArray(raw.addons) ? raw.addons : [],
        discount: Number(raw.discount) || 0,
        gstPercent: Number(raw.gstPercent) || 18,
        advancePaid: Number(raw.advancePaid) || 0,
        paymentSchedule: Array.isArray(raw.paymentSchedule) ? raw.paymentSchedule : DEFAULT_PAYMENT_SCHEDULE,
        notes: raw.notes || '',
        terms: Array.isArray(raw.terms) ? raw.terms : DEFAULT_TERMS,
        createdAt: raw.createdAt || Date.now(),
        updatedAt: raw.updatedAt || Date.now(),
      };
    }

    // Build items from legacy structure
    const generatedItems: LineItem[] = [];
    const taxRate = Number(raw.gstPercent) || 18;

    if (raw.selectedPackage) {
      const pkgDef = DEFAULT_PACKAGES.find((p) => p.id === raw.selectedPackage);
      if (pkgDef) {
        const pkgRate = pkgDef.isCustomPrice ? (Number(raw.customPackagePrice) || 0) : pkgDef.price;
        generatedItems.push({
          id: crypto.randomUUID(),
          serviceId: pkgDef.id,
          name: pkgDef.name,
          description: 'Standard package scope',
          quantity: 1,
          rate: pkgRate,
          discountPercent: 0,
          taxPercent: taxRate,
        });
      }
    }

    if (Array.isArray(raw.services)) {
      raw.services.forEach((s: any) => {
        if (s && s.selected) {
          generatedItems.push({
            id: crypto.randomUUID(),
            serviceId: s.id || null,
            name: s.name || 'Service',
            description: '',
            quantity: Number(s.quantity) || 1,
            rate: Number(s.price) || 0,
            discountPercent: 0,
            taxPercent: taxRate,
          });
        }
      });
    }

    if (Array.isArray(raw.addons)) {
      raw.addons.forEach((a: any) => {
        if (a && a.selected) {
          generatedItems.push({
            id: crypto.randomUUID(),
            serviceId: a.id || null,
            name: a.name || 'Add-on',
            description: '',
            quantity: Number(a.quantity) || 1,
            rate: Number(a.price) || 0,
            discountPercent: 0,
            taxPercent: taxRate,
          });
        }
      });
    }

    return {
      id: raw.id || crypto.randomUUID(),
      invoiceNumber: raw.invoiceNumber || 'INV-1001',
      invoiceDate: raw.invoiceDate || new Date().toISOString().split('T')[0],
      dueDate: raw.dueDate || new Date().toISOString().split('T')[0],
      status: raw.status || 'pending',
      currency: raw.currency || 'INR',
      clientId: raw.clientId || null,
      company: { ...defaultCompany, ...(raw.company || {}) },
      client: { ...defaultClient, ...(raw.client || {}) },
      items: generatedItems,
      selectedPackage: raw.selectedPackage || null,
      customPackagePrice: Number(raw.customPackagePrice) || 0,
      services: Array.isArray(raw.services) ? raw.services : [],
      addons: Array.isArray(raw.addons) ? raw.addons : [],
      discount: Number(raw.discount) || 0,
      gstPercent: taxRate,
      advancePaid: Number(raw.advancePaid) || 0,
      paymentSchedule: Array.isArray(raw.paymentSchedule) ? raw.paymentSchedule : DEFAULT_PAYMENT_SCHEDULE,
      notes: raw.notes || '',
      terms: Array.isArray(raw.terms) ? raw.terms : DEFAULT_TERMS,
      createdAt: raw.createdAt || Date.now(),
      updatedAt: raw.updatedAt || Date.now(),
    };
  } catch (error) {
    console.error('Failed to migrate invoice, returning safe fallback', error);
    return raw;
  }
}
