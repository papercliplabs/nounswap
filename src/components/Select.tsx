"use client";
import { twMerge } from "tailwind-merge";
import Icon from "./Icon";
import { useEffect, useRef, useState } from "react";
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
    // Hack to try to know when options are open, this is very difficult using <select> + <option>
    const [optionsOpen, setOptionsOpen] = useState<boolean>(false);

    return (
        // <div className="flex flex-col relative [&>div]:focus-within:text-blue-400 [&>svg]:focus-within:rotate-180">
        <div className="flex flex-col relative ">
            <div
                className={twMerge(
                    "text-caption absolute left-4 top-0 -translate-y-1/2 text-gray-600 backdrop-blur-sm transition-all duration-75 pointer-events-none",
                    selectedValue == -1 && "top-1/2 opacity-0",
                    optionsOpen && "text-blue-400"
                )}
            >
                {name}
            </div>
            <Icon
                icon="chevronDown"
                size={24}
                className={twMerge(
                    "absolute fill-gray-600 transition-all right-[16px] top-1/2 -translate-y-1/2 pointer-events-none ",
                    optionsOpen && "rotate-180"
                )}
            />
            <select
                className={twMerge(
                    "flex flex-row justify-between p-4 bg-white rounded-2xl border-2 border-gray-400 appearance-none outline-none",
                    selectedValue == -1 && "text-gray-600",
                    optionsOpen && "border-blue-400"
                )}
                value={selectedValue}
                onChange={(e) => {
                    onSelect(e.target.value);
                    setOptionsOpen(false);
                }}
                onFocus={() => setOptionsOpen(true)}
                onBlur={() => setOptionsOpen(false)}
            >
                {options.map((option, i) => (
                    <option key={i} value={option.value} className="hover:bg-gray-200 p-4 flex justify-start text-left">
                        {option.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
