interface TooltipProps {
    children: React.ReactNode;
    helperContent: string;
}

export default function Tooltip({ children, helperContent }: TooltipProps) {
    return (
        <span className="relative [&>div]:hover:flex max-w-max w-auto">
            {children}
            <div className="absolute hidden p-4 rounded-2xl bg-black text-white">{helperContent}</div>
        </span>
    );
}
