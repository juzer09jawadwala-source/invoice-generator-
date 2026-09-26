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
import { CurrencyCode, Invoice } from './types';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { GOOGLE_CLIENT_ID } from './config/auth';

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

  const handleSaveInvoice = (invoiceToSave?: Invoice) => {
    const inv = invoiceToSave || currentInvoice;
    if (!inv) return;

    // Automatically synchronize client to global clients directory
    const clientName = inv.client?.name?.trim();
    const companyName = inv.client?.companyName?.trim();

    if (clientName || companyName) {
      const existingClient = clients.find(
        (c) =>
          (inv.clientId && c.id === inv.clientId) ||
          (companyName && c.companyName?.trim().toLowerCase() === companyName.toLowerCase()) ||
          (clientName && c.name?.trim().toLowerCase() === clientName.toLowerCase())
      );

      if (existingClient) {
        updateClient(existingClient.id, {
          name: clientName || existingClient.name,
          companyName: companyName || existingClient.companyName,
          email: inv.client.email?.trim() || existingClient.email,
          phone: inv.client.phone?.trim() || existingClient.phone,
          address: inv.client.address?.trim() || existingClient.address,
        });
        inv.clientId = existingClient.id;
      } else {
        const newClient = addClient({
          name: clientName || companyName || 'Client',
          companyName: companyName || clientName || 'Client Organization',
          email: inv.client.email?.trim() || '',
          phone: inv.client.phone?.trim() || '',
          address: inv.client.address?.trim() || '',
        });
        inv.clientId = newClient.id;
      }
    }

    saveCurrent(inv);
  };

  // If currently editing an invoice, show full-screen Editor
  if (currentInvoice) {
    return (
      <Editor
        invoice={currentInvoice}
        clients={clients}
        services={services}
        onUpdate={updateCurrent}
        onSave={handleSaveInvoice}
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
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <ToastProvider>
          <MainAppContent />
        </ToastProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
