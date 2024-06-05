"use client";
import { twMerge } from "tailwind-merge";
import Icon from "./ui/Icon";
import { useState } from "react";
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
    <div className="relative flex flex-col">
      <div
        className={twMerge(
          "paragraph-sm pointer-events-none absolute left-4 top-0 -translate-y-1/2 font-londrina text-content-secondary backdrop-blur-sm transition-all duration-75",
          selectedValue == -1 && "top-1/2 opacity-0",
          optionsOpen && "text-semantic-accent"
        )}
      >
        {name}
      </div>
      <Icon
        icon="chevronDown"
        size={24}
        className={twMerge(
          "pointer-events-none absolute right-[16px] top-1/2 -translate-y-1/2 fill-gray-600 transition-all",
          optionsOpen && "rotate-180"
        )}
      />
      <select
        className={twMerge(
          "flex appearance-none flex-row justify-between rounded-2xl border-2 border-gray-400 bg-white p-4 font-londrina outline-none",
          selectedValue == -1 && "text-content-secondary",
          optionsOpen && "border-semantic-accent"
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
          <option key={i} value={option.value} className="flex justify-start p-4 text-left hover:bg-gray-200">
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}
