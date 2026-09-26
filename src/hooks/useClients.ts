import { useState, useEffect } from 'react';
import { Client } from '../types';
import { INITIAL_CLIENTS } from '../data';

const STORAGE_KEY = 'hjgyhgun_clients';
const INVOICES_STORAGE_KEY = 'hjgyhgun_invoices';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    try {
      let clientList: Client[] = [];
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          clientList = parsed;
        }
      }

      if (clientList.length === 0) {
        clientList = [...INITIAL_CLIENTS];
      } else {
        // Ensure standard seed clients like Siraj Commentator are present
        const hasSiraj = clientList.some((c: Client) =>
          c.name?.toLowerCase().includes('siraj') ||
          c.companyName?.toLowerCase().includes('siraj')
        );
        if (!hasSiraj) {
          const sirajClient = INITIAL_CLIENTS.find((c) =>
            c.name?.toLowerCase().includes('siraj') ||
            c.companyName?.toLowerCase().includes('siraj')
          );
          if (sirajClient) {
            clientList.unshift(sirajClient);
          }
        }
      }

      // Harvest any clients from saved invoices that might be missing from the directory
      const savedInvoicesStr = localStorage.getItem(INVOICES_STORAGE_KEY);
      if (savedInvoicesStr) {
        try {
          const savedInvoices = JSON.parse(savedInvoicesStr);
          if (Array.isArray(savedInvoices)) {
            for (const inv of savedInvoices) {
              if (inv?.client) {
                const cName = inv.client.name?.trim();
                const compName = inv.client.companyName?.trim();
                if (cName || compName) {
                  const exists = clientList.some(
                    (c) =>
                      (inv.clientId && c.id === inv.clientId) ||
                      (compName && c.companyName?.trim().toLowerCase() === compName.toLowerCase()) ||
                      (cName && c.name?.trim().toLowerCase() === cName.toLowerCase())
                  );

                  if (!exists) {
                    clientList.unshift({
                      id: inv.clientId || crypto.randomUUID(),
                      name: cName || compName || 'Client',
                      companyName: compName || cName || 'Client Organization',
                      email: inv.client.email?.trim() || '',
                      phone: inv.client.phone?.trim() || '',
                      address: inv.client.address?.trim() || '',
                      createdAt: inv.createdAt || Date.now(),
                    });
                  }
                }
              }
            }
          }
        } catch (e) {
          // ignore parsing error
        }
      }

      setClients(clientList);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clientList));
    } catch (e) {
      console.error('Failed to load clients', e);
      setClients(INITIAL_CLIENTS);
    }
  }, []);

  const saveClients = (newClients: Client[]) => {
    setClients(newClients);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newClients));
  };

  const addClient = (data: Omit<Client, 'id' | 'createdAt'>): Client => {
    const newClient: Client = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    const updated = [newClient, ...clients];
    saveClients(updated);
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    const updated = clients.map((c) => (c.id === id ? { ...c, ...updates } : c));
    saveClients(updated);
  };

  const deleteClient = (id: string) => {
    const updated = clients.filter((c) => c.id !== id);
    saveClients(updated);
  };

  const getClient = (id: string) => clients.find((c) => c.id === id);

  return {
    clients,
    addClient,
    updateClient,
    deleteClient,
    getClient,
  };
}
