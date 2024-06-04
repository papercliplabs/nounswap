import HowItWorksDialog from "@/components/dialog/HowItWorksDialog";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { LinkInternal } from "@/components/ui/link";
import { Suspense } from "react";
import ProgressCircle from "./ProgressCircle";

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
    <div className="flex w-full grow flex-col">
      <div className="bg-background-secondary">
        <div className="relative flex flex-row justify-between px-6 py-5 md:px-10">
          <Suspense fallback={<LoadingSpinner />}>
            <LinkInternal href={backButtonHref}>
              <Button variant="secondary">Back</Button>
            </LinkInternal>
          </Suspense>
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-row items-center justify-center gap-[7px]">
            <ProgressCircle state={currentStep > 1 ? "completed" : "active"} />
            <ProgressCircle state={currentStep > 2 ? "completed" : currentStep == 2 ? "active" : "todo"} />
          </div>
          <HowItWorksDialog />
        </div>
        <div className="flex flex-col items-center justify-center px-6 pb-10 text-center md:px-10">
          <h1>{title}</h1>
          <div>{subtitle}</div>
        </div>
      </div>
      <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
    </div>
  );
}
