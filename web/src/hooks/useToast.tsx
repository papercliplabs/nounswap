"use client";
import { ToastContext, Toast, ToastConfig } from "@/providers/toast";
import { useContext } from "react";

interface UseToastReturnType {
    toasts: Toast[];
    addToast: (config: ToastConfig) => number;
    removeToast: (id: number) => void;
}

export default function useToast(): UseToastReturnType {
    return useContext(ToastContext)!;
}
