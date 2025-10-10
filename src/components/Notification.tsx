/**
 * 通知组件
 * 用于显示成功、错误、警告和信息类型的通知
 */

import React, { useState, useEffect } from 'react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationProps {
  type: NotificationType;
  title: string;
  message?: string;
  autoClose?: boolean;
  duration?: number;
  onClose?: () => void;
}

export interface NotificationConfig {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  autoClose?: boolean;
  duration?: number;
}

// 单个通知组件
export const Notification: React.FC<NotificationProps & { id?: string }> = ({
  type,
  title,
  message,
  autoClose = true,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300); // 等待动画完成
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-6 h-6 text-green-600" />;
      case 'error':
        return <XCircleIcon className="w-6 h-6 text-red-600" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />;
      case 'info':
        return <InformationCircleIcon className="w-6 h-6 text-blue-600" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 max-w-sm w-full bg-white border rounded-lg shadow-lg z-50 transition-all duration-300 transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      } ${getStyles()}`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium">
              {title}
            </p>
            {message && (
              <p className="mt-1 text-sm opacity-90">
                {message}
              </p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={handleClose}
              className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 通知管理器
class NotificationManager {
  private notifications: NotificationConfig[] = [];
  private listeners: Array<(notifications: NotificationConfig[]) => void> = [];

  subscribe(listener: (notifications: NotificationConfig[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  show(config: Omit<NotificationConfig, 'id'>) {
    const notification: NotificationConfig = {
      ...config,
      id: Math.random().toString(36).substr(2, 9)
    };

    this.notifications.push(notification);
    this.notify();

    return notification.id;
  }

  remove(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notify();
  }

  clear() {
    this.notifications = [];
    this.notify();
  }

  // 便捷方法
  success(title: string, message?: string, options?: Partial<NotificationConfig>) {
    return this.show({ type: 'success', title, message, ...options });
  }

  error(title: string, message?: string, options?: Partial<NotificationConfig>) {
    return this.show({ type: 'error', title, message, autoClose: false, ...options });
  }

  warning(title: string, message?: string, options?: Partial<NotificationConfig>) {
    return this.show({ type: 'warning', title, message, ...options });
  }

  info(title: string, message?: string, options?: Partial<NotificationConfig>) {
    return this.show({ type: 'info', title, message, ...options });
  }
}

export const notificationManager = new NotificationManager();

// 通知容器组件
export const NotificationContainer: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationConfig[]>([]);

  useEffect(() => {
    const unsubscribe = notificationManager.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-4 pointer-events-none">
      {notifications.map(notification => (
        <div key={notification.id} className="pointer-events-auto">
          <Notification
            {...notification}
            onClose={() => notificationManager.remove(notification.id)}
          />
        </div>
      ))}
    </div>
  );
};

// React Hook for easy usage
export const useNotification = () => {
  return {
    success: notificationManager.success.bind(notificationManager),
    error: notificationManager.error.bind(notificationManager),
    warning: notificationManager.warning.bind(notificationManager),
    info: notificationManager.info.bind(notificationManager),
    clear: notificationManager.clear.bind(notificationManager)
  };
};
