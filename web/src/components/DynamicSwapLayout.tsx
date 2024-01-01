import HowItWorksDialog from "@/components/dialog/HowItWorksDialog";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { LinkInternal } from "@/components/ui/link";
import { Suspense } from "react";
import ProgressCircle from "./ui/ProgressCircle";

interface DynamicSwapLayoutProps {
    currentStep: number;
    title: string;
    subtitle: string;
    backButtonHref: string;
    children: React.ReactNode;
}

export default function DynamicSwapLayout({
    currentStep,
    title,
    subtitle,
    backButtonHref,
    children,
}: DynamicSwapLayoutProps) {
    return (
        <div className="flex flex-col w-full grow">
            <div className="bg-secondary">
                <div className="flex flex-row justify-between px-6 md:px-10 py-5 relative">
                    <Suspense fallback={<LoadingSpinner />}>
                        <LinkInternal href={backButtonHref}>
                            <Button variant="secondary">Back</Button>
                        </LinkInternal>
                    </Suspense>
                    <div className="flex flex-row gap-[7px] justify-center items-center absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 ">
                        <ProgressCircle state={currentStep > 1 ? "completed" : "active"} />
                        <ProgressCircle state={currentStep > 2 ? "completed" : currentStep == 2 ? "active" : "todo"} />
                    </div>
                    <HowItWorksDialog />
                </div>
                <div className="flex flex-col justify-center items-center text-center pb-10 px-6 md:px-10">
                    <h1>{title}</h1>
                    <div>{subtitle}</div>
                </div>
            </div>
            <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
        </div>
    );
}
