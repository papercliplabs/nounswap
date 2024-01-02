import { twMerge } from "tailwind-merge";
import Icon from "./Icon";
import React, { SVGProps } from "react";
interface LoadingProps extends SVGProps<SVGSVGElement> {
    size?: number;
}

export default function LoadingSpinner({ size, ...props }: LoadingProps) {
    return (
        <Icon
            {...props}
            icon="pending"
            size={size ?? 60}
            className={twMerge("flex w-full justify-center animate-spin", props.className)}
        />
    );
}
