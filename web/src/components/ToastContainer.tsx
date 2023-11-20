"use client";
import { ToastType } from "../contexts/toast";
import useToast from "../hooks/useToast";
import Icon from "./Icon";

export default function ToastContainer() {
    const { toasts } = useToast();

    return (
        <>
            {toasts.map((toast, i) => (
                <div
                    className="flex flex-row fixed bottom-[24px] p-4 left-1/2 -translate-x-1/2 bg-black text-white rounded-2xl  gap-2 z-50"
                    key={i}
                >
                    {toast.config.type == ToastType.Success ? (
                        <Icon icon="checkCircle" size={24} className="fill-green-600" />
                    ) : toast.config.type == ToastType.Failure ? (
                        <Icon icon="xCircle" size={24} className="fill-red-500" />
                    ) : toast.config.type == ToastType.Pending ? (
                        <Icon icon="pending" size={24} className="fill-white animate-spin" />
                    ) : (
                        <></>
                    )}

                    {toast.config.content}
                </div>
            ))}
        </>
    );
}
