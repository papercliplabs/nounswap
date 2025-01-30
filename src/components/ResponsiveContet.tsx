"use client";
import { ScreenSize, useScreenSize } from "@/hooks/useScreenSize";
import { ReactNode } from "react";

interface ResponseContentProps {
  children: ReactNode;
  screenSize: ScreenSize;
}

export function ResponsiveContent({
  children,
  screenSize,
}: ResponseContentProps) {
  const actualScreenSize = useScreenSize();
  if (screenSize == actualScreenSize) {
    return <>{children}</>;
  }
}
