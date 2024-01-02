import { twMerge } from "tailwind-merge";

interface ProgressCircleProps {
    state: "active" | "completed" | "todo";
}

export default function ProgressCircle({ state }: ProgressCircleProps) {
    return (
        <div
            className={twMerge(
                "w-3 h-3 rounded-full bg-disabled ",
                state == "active" && "bg-accent ring-4 ring-accent-light",
                state == "completed" && "bg-accent"
            )}
        ></div>
    );
}
