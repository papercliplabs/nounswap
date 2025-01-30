"use client";
import clsx from "clsx";
import { ReactNode, useEffect, useRef, useState } from "react";

interface ExpandableContentProps {
  maxCollapsedHeight: number;
  children: ReactNode;
}

export default function ExpandableContent({
  children,
  maxCollapsedHeight,
}: ExpandableContentProps) {
  const [expanded, setExpanded] = useState(false);
  const [needsExpansion, setNeedsExpansion] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Check if the content exceeds the max collapsed height
  useEffect(() => {
    if (contentRef.current) {
      setNeedsExpansion(contentRef.current.scrollHeight > maxCollapsedHeight);
    }
  }, [children, maxCollapsedHeight]);

  return (
    <div className="flex flex-col">
      <div
        ref={contentRef}
        className="relative overflow-hidden"
        style={{ maxHeight: expanded ? "none" : maxCollapsedHeight }}
      >
        {children}
        <div
          className={clsx(
            "flex",
            "absolute bottom-0 right-0",
            needsExpansion && !expanded ? "block" : "hidden",
          )}
        >
          <div className="h-[full] w-[60px] bg-gradient-to-l from-white to-transparent" />
          <button
            onClick={() => setExpanded(true)}
            className="bg-white pl-2 underline"
          >
            More
          </button>
        </div>
      </div>
    </div>
  );
}
