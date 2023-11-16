import { ToastContext, Toast, ToastConfig } from "@/contexts/toast";
import { useContext } from "react";

interface UseToastReturnType {
    toasts: Toast[];
    addToast: (config: ToastConfig) => number;
    removeToast: (id: number) => void;
}

export default function useToast(): UseToastReturnType {
    return useContext(ToastContext)!;
}
