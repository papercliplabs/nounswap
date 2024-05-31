import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/utils";
import clsx from "clsx";

const buttonVariants = cva(
    clsx(
        "inline-flex items-center justify-center whitespace-nowrap rounded-2xl",
        "transition-all enabled:active:clickable-active",
        "disabled:pointer-events-none disabled:opacity-50 disabled:bg-disabled disabled:text-primary",
        "ring-offset-2 focus-visible:ring-1 ring-gray-900 focus-visible:outline-none"
    ),
    {
        variants: {
            variant: {
                primary: "bg-accent text-white hover:bg-accent-dark",
                secondary: "bg-white text-primary border-2 hover:bg-secondary",
                negative: "bg-negative text-white hover:bg-negative-dark",
                positive: "bg-positive text-white hover:bg-positive-dark",
                ghost: "bg-transparent text-black hover:bg-secondary",
            },
            size: {
                default: "px-8 py-4",
                icon: "p-4",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, children, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
                {" "}
                {typeof children === "string" ? <h6>{children}</h6> : children}{" "}
            </Comp>
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
