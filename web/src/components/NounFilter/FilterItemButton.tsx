import { ButtonHTMLAttributes } from "react";
import { Checkbox } from "../ui/checkbox";

interface FilterItemButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isChecked: boolean;
}

export function FilterItemButton({ isChecked, children, ...props }: FilterItemButtonProps) {
  return (
    <button
      className="hover:bg-background-secondary *:hover:border-content-primary flex w-full items-center justify-between rounded-xl px-2 py-3"
      {...props}
    >
      {children}
      <Checkbox checked={isChecked} tabIndex={-1} />
    </button>
  );
}
