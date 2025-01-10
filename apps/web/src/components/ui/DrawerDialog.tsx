"use client";
import { useScreenSize } from "@/hooks/useScreenSize";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "./dialogBase";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "./drawer";
import { HTMLAttributes, ReactNode, useMemo, useState } from "react";

export function DrawerDialog({
  children,
  open,
  onOpenChange,
}: {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  nonDismissable?: boolean;
}) {
  const [openUncontrolled, setOpenUncontrolled] = useState<boolean>(false);
  const screenSize = useScreenSize();

  const { openInternal, setOpenInternal } = useMemo(() => {
    return {
      openInternal: open ?? openUncontrolled,
      setOpenInternal: onOpenChange ?? setOpenUncontrolled,
    };
  }, [open, onOpenChange, openUncontrolled, setOpenUncontrolled]);

  return screenSize == "sm" ? (
    <Drawer open={openInternal} onOpenChange={setOpenInternal}>
      {children}
    </Drawer>
  ) : (
    <Dialog open={openInternal} onOpenChange={setOpenInternal}>
      {children}
    </Dialog>
  );
}

export function DrawerDialogTrigger(
  props: { asChild?: boolean } & HTMLAttributes<HTMLButtonElement>,
) {
  const screenSize = useScreenSize();
  return screenSize == "sm" ? (
    <DrawerTrigger {...props} />
  ) : (
    <DialogTrigger {...props} />
  );
}

export function DrawerDialogContent({
  ignoreOutsideInteractions,
  ...props
}: {
  ignoreOutsideInteractions?: boolean;
} & HTMLAttributes<HTMLDivElement>) {
  const screenSize = useScreenSize();
  return screenSize == "sm" ? (
    <DrawerContent
      onInteractOutside={(event) =>
        ignoreOutsideInteractions ? event.preventDefault() : {}
      }
      {...props}
    />
  ) : (
    <DialogContent
      onInteractOutside={(event) =>
        ignoreOutsideInteractions ? event.preventDefault() : {}
      }
      {...props}
    />
  );
}

export function DrawerDialogTitle(props: HTMLAttributes<HTMLDivElement>) {
  const screenSize = useScreenSize();
  return screenSize == "sm" ? (
    <DrawerTitle {...props} />
  ) : (
    <DialogTitle {...props} />
  );
}
