import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useInvoices } from './hooks/useInvoices';
import { useClients } from './hooks/useClients';
import { useServices } from './hooks/useServices';
import { useSettings } from './hooks/useSettings';
import { AppShell, AppView } from './components/AppShell';
import { Dashboard } from './components/Dashboard';
import { InvoicesList } from './components/InvoicesList';
import { ClientsView } from './components/ClientsView';
import { ServicesView } from './components/ServicesView';
import { SettingsView } from './components/SettingsView';
import { Editor } from './components/Editor';
import { ToastProvider, useToast } from './components/Toast';
import { CurrencyCode } from './types';

function MainAppContent() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [currency, setCurrency] = useState<CurrencyCode>('INR');

  const {
    invoices,
    currentInvoice,
    createNew,
    loadInvoice,
    deleteInvoice,
    duplicateInvoice,
    updateCurrent,
    saveCurrent,
    setCurrentInvoice,
  } = useInvoices();

  const {
    clients,
    addClient,
    updateClient,
    deleteClient,
  } = useClients();

  const {
    services,
    addService,
    updateService,
    deleteService,
    resetToDefaults,
  } = useServices();

  const {
    settings,
    updateSettings,
  } = useSettings();

  const handleCreateNewInvoice = (clientId?: string | null) => {
    const newInv = createNew(clientId);
    // Apply studio settings defaults
    newInv.currency = currency;
    newInv.company = { ...settings.company };
    newInv.terms = [...settings.defaultTerms];
    newInv.gstPercent = settings.defaultTaxRate;
    if (clientId) {
      const c = clients.find((item) => item.id === clientId);
      if (c) {
        newInv.client = {
          name: c.name,
          companyName: c.companyName,
          email: c.email,
          phone: c.phone,
          address: c.address,
          projectName: '',
        };
      }
    }
    setCurrentInvoice(newInv);
  };

  const handleCurrencyChange = (newCurrency: CurrencyCode) => {
    setCurrency(newCurrency);
    updateSettings({ defaultCurrency: newCurrency });
    if (currentInvoice) {
      updateCurrent({ currency: newCurrency });
    }
  };

  // If currently editing an invoice, show full-screen Editor
  if (currentInvoice) {
    return (
      <Editor
        invoice={currentInvoice}
        clients={clients}
        services={services}
        onUpdate={updateCurrent}
        onSave={saveCurrent}
        onClose={() => setCurrentInvoice(null)}
        onAddClient={addClient}
      />
    );
  }

  // Otherwise render the AppShell with the active view
  return (
    <AppShell
      currentView={currentView}
      onNavigate={(view) => setCurrentView(view)}
      currency={currency}
      onCurrencyChange={handleCurrencyChange}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {currentView === 'dashboard' && (
            <Dashboard
              invoices={invoices}
              currency={currency}
              onCreateNew={() => handleCreateNewInvoice()}
              onLoad={loadInvoice}
              onDelete={deleteInvoice}
              onDuplicate={duplicateInvoice}
              onNavigate={(view) => setCurrentView(view)}
            />
          )}

          {currentView === 'invoices' && (
            <InvoicesList
              invoices={invoices}
              currency={currency}
              onCreateNew={() => handleCreateNewInvoice()}
              onLoad={loadInvoice}
              onDelete={deleteInvoice}
              onDuplicate={duplicateInvoice}
            />
          )}

          {currentView === 'clients' && (
            <ClientsView
              clients={clients}
              invoices={invoices}
              currency={currency}
              onAddClient={addClient}
              onUpdateClient={updateClient}
              onDeleteClient={deleteClient}
              onCreateInvoiceForClient={(clientId) => handleCreateNewInvoice(clientId)}
            />
          )}

          {currentView === 'services' && (
            <ServicesView
              services={services}
              currency={currency}
              onAddService={addService}
              onUpdateService={updateService}
              onDeleteService={deleteService}
              onResetDefaults={resetToDefaults}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={updateSettings}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </AppShell>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainAppContent />
    </ToastProvider>
  );
}
