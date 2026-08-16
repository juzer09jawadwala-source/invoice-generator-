import { useState, useEffect } from 'react';
import { Client } from '../types';
import { INITIAL_CLIENTS } from '../data';

const STORAGE_KEY = 'hjgyhgun_clients';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setClients(parsed);
          return;
        }
      }
      setClients(INITIAL_CLIENTS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CLIENTS));
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
