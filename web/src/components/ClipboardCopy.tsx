import { ToastContext, ToastType } from "@/providers/toast";
import { HTMLAttributes, ReactNode, useCallback, useContext } from "react";

interface ClipboardCopyProps extends HTMLAttributes<HTMLDivElement> {
  copyContent: string;
  children: ReactNode;
}

export function ClipboardCopy({
  copyContent,
  children,
  ...props
}: ClipboardCopyProps) {
  const { addToast } = useContext(ToastContext);
  const copy = useCallback(() => {
    navigator.clipboard
      .writeText(copyContent)
      .then(() => {
        addToast?.({ content: "Copied to clipboard", type: ToastType.Success });
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        addToast?.({
          content: "Copy not supported on this device",
          type: ToastType.Failure,
        });
      });
  }, [copyContent, addToast]);

  return (
    <div onClick={copy} {...props}>
      {children}
    </div>
  );
}
