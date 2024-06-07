import HowItWorksDialog from "@/components/dialog/HowItWorksDialog";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import ProgressCircle from "./ProgressCircle";
import Link from "next/link";
import Icon from "./ui/Icon";

interface DynamicSwapLayoutProps {
  currentStep: number;
  title: string;
  subtitle: string;
  backButtonHref: string;
  children: React.ReactNode;
  // progressSection: React.ReactNode;
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
            <Link href={backButtonHref}>
              <Button variant="secondary">Back</Button>
            </Link>
          </Suspense>
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-row items-center justify-center gap-[7px]">
            <ProgressCircle state={currentStep > 1 ? "completed" : "active"} />
            <ProgressCircle state={currentStep > 2 ? "completed" : currentStep == 2 ? "active" : "todo"} />
          </div>
          <HowItWorksDialog>
            <Button variant="ghost" size="icon" className="gap-2">
              <h6 className="text-content-secondary hidden md:block">How it works</h6>
              <Icon icon="questionCircle" size={20} className="fill-gray-600" />
            </Button>
          </HowItWorksDialog>
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
