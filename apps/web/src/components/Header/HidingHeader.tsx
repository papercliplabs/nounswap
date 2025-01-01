"use client";
import { useScreenSize } from "@/hooks/useScreenSize";
import clsx from "clsx";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ReactNode, useRef, useState } from "react";

interface HidingHeaderProps {
  children: ReactNode;
}

export default function HidingHeader({ children }: HidingHeaderProps) {
  const [isHidden, setIsHidden] = useState(false);
  const { scrollY } = useScroll();
  const lastYRef = useRef(0);
  const screenSize = useScreenSize();

  useMotionValueEvent(scrollY, "change", (y) => {
    const difference = y - lastYRef.current;
    if (y < 100) {
      setIsHidden(false);
    } else if (Math.abs(difference) > 50) {
      setIsHidden(difference > 0);
      lastYRef.current = y;
    }
  });

  return (
    <motion.header
      variants={{
        hidden: {
          y: "-100%",
        },
        visible: {
          y: 0,
        },
      }}
      transition={{ duration: 0.25, type: "spring", bounce: 0 }}
      animate={isHidden && screenSize == "sm" ? "hidden" : "visible"}
      className="sticky top-0 z-[150]"
    >
      {children}
    </motion.header>
  );
}
