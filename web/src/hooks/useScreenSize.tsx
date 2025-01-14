"use client";
import { tailwindFullTheme } from "@/theme/tailwindFullTheme";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

type ScreenSize = "sm" | "md" | "lg" | undefined;

export function useScreenSize(): ScreenSize {
  const [screenSize, setScreenSize] = useState<ScreenSize>("lg");

  const md = useMediaQuery(`(min-width: ${tailwindFullTheme.theme.screens.md})`);
  const lg = useMediaQuery(`(min-width:${tailwindFullTheme.theme.screens.lg})`);

  useEffect(() => {
    setScreenSize(lg ? "lg" : md ? "md" : "sm");
  }, [md, lg]);

  return screenSize;
}
