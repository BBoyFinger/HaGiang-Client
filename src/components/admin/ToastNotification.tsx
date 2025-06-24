import React, { useEffect } from 'react';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastNotificationProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ toasts, onRemove }) => {
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        onRemove(toasts[0].id);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toasts, onRemove]);

  return (
    <div className="fixed top-6 right-6 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded shadow-lg text-white flex items-center space-x-2 animate-fadeIn
            ${toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'}`}
        >
          {toast.type === 'success' && <span>✅</span>}
          {toast.type === 'error' && <span>❌</span>}
          {toast.type === 'info' && <span>ℹ️</span>}
          <span>{toast.message}</span>
          <button
            className="ml-2 text-white/80 hover:text-white text-lg"
            onClick={() => onRemove(toast.id)}
          >×</button>
        </div>
      ))}
    </div>
  );
};

export default ToastNotification; 