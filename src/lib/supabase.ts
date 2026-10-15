import { createClient } from '@supabase/supabase-js';
import type { PushNotification } from '../types';

export const SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || 'https://yssrrfpfgjfhaogudwux.supabase.co';

export const SUPABASE_ANON_KEY = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlzc3JyZnBmZ2pmaGFvZ3Vkd3V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5NTM0NDIsImV4cCI6MjEwNzUyOTQ0Mn0.ZlNNK4xUXRF3nMeoHZDNBVSI5V0OqS29x00uWFJbSE0';

export const GOOGLE_DRIVE_FOLDER_URL =
  import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_URL ||
  'https://drive.google.com/drive/folders/1J7UuZifuWFJK50Tby_aOMoxU5F0qFw6K?usp=sharing';

// Supabase Client instance
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Real-time Push Notification Channel
export class NotificationService {
  private static channel = supabase.channel('canarias-scout-broadcast');
  private static listeners: ((notification: PushNotification) => void)[] = [];

  public static init() {
    this.channel
      .on('broadcast', { event: 'push-notification' }, (payload) => {
        if (payload?.payload) {
          const notif = payload.payload as PushNotification;
          this.notifyListeners(notif);
        }
      })
      .subscribe((status) => {
        console.log('[Supabase Realtime Channel Status]:', status);
      });
  }

  public static onNotification(callback: (notification: PushNotification) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private static notifyListeners(notification: PushNotification) {
    this.listeners.forEach((cb) => {
      try {
        cb(notification);
      } catch (err) {
        console.error('Error invoking notification listener', err);
      }
    });
  }

  public static async broadcastNotification(notification: Omit<PushNotification, 'id' | 'timestamp' | 'read'>) {
    const fullNotification: PushNotification = {
      ...notification,
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };

    // Notify local tabs immediately
    this.notifyListeners(fullNotification);

    // Also broadcast through Supabase Realtime for other clients
    try {
      await this.channel.send({
        type: 'broadcast',
        event: 'push-notification',
        payload: fullNotification,
      });
    } catch (e) {
      console.warn('Realtime broadcast offline or connecting...', e);
    }

    return fullNotification;
  }
}
