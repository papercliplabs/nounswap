"use client";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useOnClickOutside } from "usehooks-ts";

export default function TestPage() {
  return (
    <div className="flex gap-2">
      <TestItem i={1} />
      <TestItem i={2} />
      <TestItem i={3} />
      <ButtonTrigger i={100} />
    </div>
  );
}

function ButtonTrigger({ i }: { i: number }) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <button onClick={() => setOpen(!open)}>TOG</button>
      <Modal open={open} onClose={() => setOpen(false)} i={i} />
    </>
  );
}

function TestItem({ i }: { i: number }) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <button onClick={() => setOpen(!open)}>
        <motion.div layoutId={`wrapper-${i}`} className="flex h-[100px] w-[100px] rounded-md bg-blue-200 p-1">
          <div className="flex">
            <motion.img layoutId={`icon-${i}`} src="/swap-icon.svg" className="h-[20px] w-[20px]" />
            <motion.div layoutId={`title-${i}`}>TITLE</motion.div>
          </div>
        </motion.div>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} i={i} />
    </>
  );
}

function Modal({ open, i, onClose }: { open: boolean; i: number; onClose: () => void }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(ref as any, () => {
    onClose();
  });

  return (
    <>
      {createPortal(
        <>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              />
            )}
          </AnimatePresence>
          <AnimatePresence initial={false} mode="wait">
            {open && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  // initial={{ opacity: 0, y: 100 }}
                  // animate={{ opacity: 1, y: 0 }}
                  // exit={{ opacity: 0, y: 100 }}

                  layoutId={`wrapper-${i}`}
                  className="flex h-[400px] w-[400px] overflow-hidden rounded-xl bg-blue-200 p-4"
                  ref={ref}
                >
                  <div className="flex">
                    <motion.img layoutId={`icon-${i}`} src="/swap-icon.svg" className="h-[40px] w-[40px]" />
                    <motion.div layoutId={`title-${i}`} className="text-[40px]">
                      TITLE
                    </motion.div>
                  </div>
                  <div>MORE CONTENT :)</div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>,
        document.body
      )}
    </>
  );
}
