import { useState, useEffect } from 'react';
import { CatalogService } from '../types';
import { SERVICE_CATALOG } from '../data';

const STORAGE_KEY = 'hjgyhgun_services';

export function useServices() {
  const [services, setServices] = useState<CatalogService[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setServices(parsed);
          return;
        }
      }
      setServices(SERVICE_CATALOG);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SERVICE_CATALOG));
    } catch (e) {
      console.error('Failed to load services', e);
      setServices(SERVICE_CATALOG);
    }
  }, []);

  const saveServices = (newServices: CatalogService[]) => {
    setServices(newServices);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newServices));
  };

  const addService = (data: Omit<CatalogService, 'id'>): CatalogService => {
    const newService: CatalogService = {
      ...data,
      id: `svc-${Date.now().toString(36)}`,
    };
    const updated = [newService, ...services];
    saveServices(updated);
    return newService;
  };

  const updateService = (id: string, updates: Partial<CatalogService>) => {
    const updated = services.map((s) => (s.id === id ? { ...s, ...updates } : s));
    saveServices(updated);
  };

  const deleteService = (id: string) => {
    const updated = services.filter((s) => s.id !== id);
    saveServices(updated);
  };

  const resetToDefaults = () => {
    saveServices(SERVICE_CATALOG);
  };

  return {
    services,
    addService,
    updateService,
    deleteService,
    resetToDefaults,
  };
}
