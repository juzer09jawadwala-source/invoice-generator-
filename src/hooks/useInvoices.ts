import { useState, useEffect } from 'react';
import { Invoice } from '../types';
import { createEmptyInvoice, DEMO_INVOICES_SEED } from '../data';
import { migrateInvoice } from '../lib/migrate';

const STORAGE_KEY = 'hjgyhgun_invoices';

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const migrated = parsed.map((inv: any) => migrateInvoice(inv));
          setInvoices(migrated);
        } else {
          // Empty array saved, seed demo
          setInvoices(DEMO_INVOICES_SEED);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_INVOICES_SEED));
        }
      } else {
        // First run: seed demo invoices
        setInvoices(DEMO_INVOICES_SEED);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_INVOICES_SEED));
      }
    } catch (e) {
      console.error('Failed to parse saved invoices', e);
      setInvoices(DEMO_INVOICES_SEED);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const saveInvoices = (newInvoices: Invoice[]) => {
    setInvoices(newInvoices);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newInvoices));
  };

  const getNextInvoiceNumber = (): string => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      let invs: Invoice[] = [];
      if (saved) {
        invs = JSON.parse(saved).map((i: any) => migrateInvoice(i));
      } else {
        invs = invoices;
      }

      // Check existing numbers
      const numbers = invs.map((inv) => {
        const match = inv.invoiceNumber?.match(/(?:INV|NOIR)-?(\d+)/i);
        return match ? parseInt(match[1], 10) : 0;
      });

      const maxNum = numbers.length > 0 ? Math.max(...numbers, 1000) : 1000;
      return `INV-${maxNum + 1}`;
    } catch (e) {
      return `INV-${1000 + invoices.length + 1}`;
    }
  };

  const createNew = (clientId?: string | null) => {
    const newInv = createEmptyInvoice(getNextInvoiceNumber());
    if (clientId) {
      newInv.clientId = clientId;
    }
    setCurrentInvoice(newInv);
    return newInv;
  };

  const saveCurrent = (invoiceToSave?: Invoice) => {
    const target = invoiceToSave || currentInvoice;
    if (!target) return;

    const updated = { ...target, updatedAt: Date.now() };
    const existingIndex = invoices.findIndex((i) => i.id === updated.id);

    let newInvoices = [...invoices];
    if (existingIndex >= 0) {
      newInvoices[existingIndex] = updated;
    } else {
      newInvoices.unshift(updated);
    }

    saveInvoices(newInvoices);
    setCurrentInvoice(updated);
  };

  const loadInvoice = (id: string) => {
    const found = invoices.find((i) => i.id === id);
    if (found) {
      setCurrentInvoice({ ...found });
    }
  };

  const deleteInvoice = (id: string) => {
    const newInvoices = invoices.filter((i) => i.id !== id);
    saveInvoices(newInvoices);
    if (currentInvoice?.id === id) {
      setCurrentInvoice(null);
    }
  };

  const duplicateInvoice = (id: string) => {
    const found = invoices.find((i) => i.id === id);
    if (found) {
      const duplicated: Invoice = {
        ...found,
        id: crypto.randomUUID(),
        invoiceNumber: getNextInvoiceNumber(),
        status: 'draft',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const newInvoices = [duplicated, ...invoices];
      saveInvoices(newInvoices);
      setCurrentInvoice(duplicated);
    }
  };

  const updateCurrent = (updates: Partial<Invoice>) => {
    if (currentInvoice) {
      setCurrentInvoice({ ...currentInvoice, ...updates });
    }
  };

  return {
    invoices,
    currentInvoice,
    isInitialized,
    createNew,
    saveCurrent,
    loadInvoice,
    deleteInvoice,
    duplicateInvoice,
    updateCurrent,
    setCurrentInvoice,
  };
}
