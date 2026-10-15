import React, { useState, useEffect } from 'react';
import { Bell, X, Sparkles, Award, Eye, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { PushNotification } from '../../types';

export const NotificationToast: React.FC = () => {
  const { notifications, markNotificationRead } = useApp();
  const [activeToast, setActiveToast] = useState<PushNotification | null>(null);

  // Show latest unread notification when added
  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[0];
      if (!latest.read) {
        setActiveToast(latest);
        const timer = setTimeout(() => {
          setActiveToast(null);
        }, 5500);
        return () => clearTimeout(timer);
      }
    }
  }, [notifications]);

  if (!activeToast) return null;

  const handleDismiss = () => {
    markNotificationRead(activeToast.id);
    setActiveToast(null);
  };

  const getIcon = () => {
    switch (activeToast.type) {
      case 'observation':
        return <Eye className="h-4 w-4 text-sky-400" />;
      case 'callup':
        return <Award className="h-4 w-4 text-emerald-400" />;
      case 'priority':
        return <Sparkles className="h-4 w-4 text-amber-400" />;
      default:
        return <Bell className="h-4 w-4 text-amber-400" />;
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm rounded-2xl border border-slate-700 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 border border-slate-700">
          {getIcon()}
        </div>
        <div className="flex-1 pr-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
              Push Notificación en Vivo
            </span>
            <span className="text-[9px] text-slate-500">{activeToast.timestamp}</span>
          </div>
          <h4 className="text-xs font-bold text-white mt-0.5">{activeToast.title}</h4>
          <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">{activeToast.message}</p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-slate-500 hover:text-white transition-colors"
          aria-label="Cerrar notificación"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
