"use client";
import { createContext, useCallback, useState } from "react";

const TOAST_TIMEOUT_MS = 3000;
let id = 0;

export enum ToastType {
  Success,
  Failure,
  Pending,
}

export interface ToastConfig {
  content: React.ReactNode;
  type: ToastType;
}

export interface Toast {
  id: number;
  config: ToastConfig;
}

interface ToastContextType {
  toasts: Toast[];
  addToast?: (config: ToastConfig) => number;
  removeToast?: (id: number) => void;
}

export const ToastContext = createContext<ToastContextType>({
  toasts: [],
  addToast: undefined,
  removeToast: undefined,
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback(
    (id: number) => {
      setToasts((toasts) => toasts.filter((t) => t.id != id));
    },
    [setToasts]
  );

  const addToast = useCallback(
    (config: ToastConfig) => {
      const _id = id++;
      setToasts((toasts) => [...toasts, { id: _id, config }]);

      if (config.type != ToastType.Pending) {
        setTimeout(() => removeToast(_id), TOAST_TIMEOUT_MS);
      }

      return _id;
    },
    [setToasts, removeToast]
  );

  return <ToastContext.Provider value={{ toasts, addToast, removeToast }}>{children}</ToastContext.Provider>;
}
