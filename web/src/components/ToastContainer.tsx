"use client";
import { ToastContext, ToastType } from "@/providers/toast";
import Icon from "./ui/Icon";
import { useContext } from "react";

export default function ToastContainer() {
  const { toasts } = useContext(ToastContext);

  return (
    <>
      {toasts.map((toast, i) => (
        <div
          className="paragraph-md shadow-overlay bg-background-dark pointer-events-auto fixed bottom-[24px] left-1/2 z-[100] flex min-w-[min(288px,95vw)] -translate-x-1/2 flex-row items-center gap-3 rounded-xl p-4 text-white"
          key={i}
        >
          {toast.config.type == ToastType.Success ? (
            <Icon icon="circleCheck" size={20} className="fill-green-300" />
          ) : toast.config.type == ToastType.Failure ? (
            <Icon icon="circleX" size={20} className="fill-red-300" />
          ) : toast.config.type == ToastType.Pending ? (
            <Icon icon="spinner" size={20} className="animate-spin fill-white" />
          ) : (
            <></>
          )}

          {toast.config.content}
        </div>
      ))}
    </>
  );
}
