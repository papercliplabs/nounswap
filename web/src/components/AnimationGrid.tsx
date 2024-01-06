"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Noun } from "@/lib/types";
import { LinkInternal } from "./ui/link";
import NounCard from "./NounCard";

interface AnimateGridProps {
    // items: React.ReactNode[];
    nouns: Noun[];
}
export default function AnimationGird({ nouns }: AnimateGridProps) {
    return (
        <ul className="justify-stretch items-stretch gap-6 grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] auto-rows-min grow text-secondary">
            <AnimatePresence mode="wait">
                {nouns.map((noun, i) => (
                    <motion.li
                        initial={{ transform: "scale(0)" }}
                        animate={{ transform: "scale(1)" }}
                        exit={{ transform: "scale(0)" }}
                        layout
                        key={noun.id}
                    >
                        <LinkInternal
                            href={`/swap/${noun.chainId}/${noun.id}`}
                            key={i}
                            className="active:clickable-active "
                        >
                            <NounCard noun={noun} enableHover key={i} />
                        </LinkInternal>
                    </motion.li>
                ))}
            </AnimatePresence>
        </ul>
    );
}
