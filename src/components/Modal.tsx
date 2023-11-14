import useClickOutside from "@/hooks/useClickOutside";
import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import Icon from "./Icon";

export interface ModalProps {
    title: string;
    isOpen: boolean;
    children: React.ReactNode;
    onClose: () => void;
}

export default function Modal({ title, isOpen, children, onClose }: ModalProps) {
    const ref = useRef<HTMLDivElement>(null);

    // Will callback to close when clicked outside of ref
    useClickOutside({ ref, onClickOutside: onClose });

    return (
        <>
            <div
                className={twMerge(
                    "fixed top-0 left-0 bg-gray-700 opacity-50 w-full h-full backdrop-blur-md z-50",
                    !isOpen && "hidden"
                )}
            />
            <div
                className={twMerge(
                    "w-[420px] max-h-[520px] bg-gray-100 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden flex flex-col z-50 rounded-2xl shadow-md",
                    !isOpen && "hidden"
                )}
                ref={ref}
            >
                <div className="flex flex-row pl-6 pr-2 py-4 text-gray-900 justify-between items-center">
                    <h4>{title}</h4>
                    <button className="ghost" onClick={onClose}>
                        <Icon icon="x" size={16} />
                    </button>
                </div>
                <div className="flex flex-col overflow-y-auto">{children}</div>
            </div>
        </>
    );
}
