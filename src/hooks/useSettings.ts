import { useState, useEffect } from 'react';
import { AppSettings, CompanyDetails } from '../types';
import { DEFAULT_TERMS } from '../data';

const STORAGE_KEY = 'hjgyhgun_settings';

const DEFAULT_SETTINGS: AppSettings = {
  company: {
    name: 'Noir Labs',
    phone: '+91 9167868179',
    email: 'juzer09jawadwala@gmail.com',
    website: 'www.noirlabs.com',
    gstNumber: '27AABCU9603R1ZM',
    upiId: 'juzerjawadwala66@okaxisbank',
    address: 'Anjeerwadi, Thakkar Estate, Mazgaon, Mumbai 400010',
    logoUrl: '',
  },
  defaultCurrency: 'INR',
  defaultTaxRate: 18,
  defaultTerms: DEFAULT_TERMS,
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings({
          ...DEFAULT_SETTINGS,
          ...parsed,
          company: {
            ...DEFAULT_SETTINGS.company,
            ...(parsed.company || {}),
          },
        });
        return;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    } catch (e) {
      console.error('Failed to load settings', e);
      setSettings(DEFAULT_SETTINGS);
    }
  }, []);

  const saveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    const updated: AppSettings = {
      ...settings,
      ...updates,
      company: {
        ...settings.company,
        ...(updates.company || {}),
      },
    };
    saveSettings(updated);
  };

  const updateCompany = (companyUpdates: Partial<CompanyDetails>) => {
    const updated: AppSettings = {
      ...settings,
      company: {
        ...settings.company,
        ...companyUpdates,
      },
    };
    saveSettings(updated);
  };

  return {
    settings,
    updateSettings,
    updateCompany,
  };
}
