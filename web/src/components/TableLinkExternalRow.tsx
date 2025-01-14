"use client";
import { ComponentProps, ReactNode } from "react";
import { TableRow } from "./ui/table";
import { cn } from "@/utils/shadcn";

interface TableLinkRowProps extends ComponentProps<typeof TableRow> {
  href: string;
  children: ReactNode;
}

export function TableLinkExternalRow({ href, children, className }: TableLinkRowProps) {
  return (
    <TableRow className={cn("cursor-pointer", className)} onClick={() => window.open(href)}>
      {children}
    </TableRow>
  );
}
