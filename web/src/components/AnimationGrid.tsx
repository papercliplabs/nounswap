"use client";
import { motion, AnimatePresence } from "framer-motion";

interface AnimateGridProps {
    items: { element: React.ReactNode; id: number }[];
    disableAnimateIn?: boolean;
    disableAnimateOut?: boolean;
}
export default function AnimationGird({ items, disableAnimateIn, disableAnimateOut }: AnimateGridProps) {
    return (
        <ul className="justify-stretch items-stretch gap-6 grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] auto-rows-min grow text-secondary">
            <AnimatePresence mode="popLayout">
                {items.map((item, i) => (
                    <motion.li
                        initial={disableAnimateIn ? false : { transform: "scale(0)" }}
                        animate={{ transform: "scale(1)" }}
                        exit={disableAnimateOut ? { opacity: 1 } : { opacity: 0 }}
                        layout
                        key={item.id}
                    >
                        {item.element}
                    </motion.li>
                ))}
            </AnimatePresence>
        </ul>
    );
}
