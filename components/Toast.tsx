import React, { useState, useEffect } from 'react';

export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: 'bg-green-500 border-green-600',
    error: 'bg-red-500 border-red-600',
    warning: 'bg-orange-500 border-orange-600',
    info: 'bg-blue-500 border-blue-600'
  };

  const typeIcons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div className={`
      fixed top-4 right-4 z-50 
      ${typeStyles[type]} 
      text-white px-4 py-3 rounded-xl shadow-soft-lg border-l-4
      transform transition-all duration-300 ease-out
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      max-w-sm
    `}>
      <div className="flex items-center gap-3">
        <span className="text-lg">{typeIcons[type]}</span>
        <p className="text-sm font-medium flex-1">{message}</p>
        <button 
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-white/80 hover:text-white text-lg leading-none"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};

// Toast container component
interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type: ToastProps['type'] }>;
  removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-2">
      {toasts.map((toast, index) => (
        <div 
          key={toast.id} 
          style={{ transform: `translateY(${index * 80}px)` }}
          className="transition-transform duration-200"
        >
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default Toast;
