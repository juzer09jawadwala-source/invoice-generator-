import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'error';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl shadow-2xl border border-[#F4E7C8]/20 bg-[#150E0C]/95 backdrop-blur-xl text-[#F4E7C8] text-sm"
            >
              <div className="flex items-center gap-2.5">
                {toast.type === 'success' && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
                {toast.type === 'error' && (
                  <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                )}
                {toast.type === 'info' && (
                  <div className="w-6 h-6 rounded-full bg-[#E85D3F]/20 text-[#E85D3F] flex items-center justify-center flex-shrink-0">
                    <Info className="w-4 h-4" />
                  </div>
                )}
                <span className="font-semibold text-[#F4E7C8] text-xs sm:text-sm">{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-[#D8CBB7] hover:text-[#F4E7C8] p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
