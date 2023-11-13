import { twMerge } from "tailwind-merge";

interface ProgressCircleProps {
    state: "active" | "completed" | "todo";
}

export default function ProgressCircle({ state }: ProgressCircleProps) {
    return (
        <div
            className={twMerge(
                "w-3 h-3 rounded-full bg-gray-200 border-white",
                state == "active" && "w-[18px] h-[18px] border-[3px] bg-blue-500 border-blue-100",
                state == "completed" && "bg-blue-500"
            )}
        ></div>
    );
}
