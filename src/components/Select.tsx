"use client";
import { twMerge } from "tailwind-merge";
import Icon from "./Icon";
import { useRef, useState } from "react";
import useClickOutside from "@/hooks/useClickOutside";
export interface SelectProps<T> {
    name: string;
    selectedValue: T;
    options: {
        name: string;
        value: T;
    }[];
    onSelect: (value: T) => void;
}

export default function Select({ name, selectedValue, options, onSelect }: SelectProps<any>) {
    const [open, setOpen] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close options when clicked outside
    useClickOutside({ ref, onClickOutside: () => setOpen(false) });

    return (
        <div className="flex flex-col relative" ref={ref}>
            <div
                className={twMerge(
                    "text-caption absolute left-4 top-0 -translate-y-1/2 text-gray-600 backdrop-blur-sm",
                    selectedValue == -1 && "hidden",
                    open && "text-blue-400"
                )}
            >
                {name}
            </div>
            <div
                className={twMerge(
                    "flex flex-row justify-between p-4 bg-white rounded-2xl border-2 border-gray-400 appearance-none",
                    selectedValue == -1 && " text-gray-600",
                    open && "border-blue-400"
                )}
                onClick={() => setOpen(!open)}
            >
                {options.find((op) => op.value == selectedValue)?.name ?? name}
                <Icon
                    icon="chevronDown"
                    size={24}
                    className={twMerge("fill-gray-600 transition-all", open && "rotate-180 ")}
                />
            </div>
            <div
                className={twMerge(
                    "absolute bottom-0 left-0 translate-y-full w-full bg-white z-10 flex flex-col rounded-2xl  max-h-[300px] overflow-y-scroll shadow-2xl",
                    !open && "hidden"
                )}
            >
                {options.map((option, i) => (
                    <button
                        key={i}
                        className="hover:bg-gray-200 p-4 flex justify-start text-left"
                        onClick={() => {
                            setOpen(false);
                            onSelect(option.value);
                        }}
                    >
                        {option.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
