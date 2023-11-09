import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

interface ModalProps {
    isOpen: boolean;
    children: React.ReactNode;
    onClose: () => void;
}

export default function Modal({ isOpen, children, onClose }: ModalProps) {
    const ref = useRef<HTMLDivElement>(null);

    // Close when clicked outside
    useEffect(() => {
        function handleClickOutside(event: any) {
            if (ref.current && !ref.current.contains(event.target)) {
                onClose();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mouseDown", handleClickOutside);
        };
    }, [ref, onClose]);

    return (
        <div className={twMerge(isOpen ? "block" : "hidden")}>
            <div className="fixed top-0 left-0 bg-gray-700 opacity-50 w-full h-full blur-xl"></div>
            <div
                className="w-[400px] h-[400px] bg-gray-100 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden flex flex-col"
                ref={ref}
            >
                {children}
            </div>
        </div>
    );
}
