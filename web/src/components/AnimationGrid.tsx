"use client";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { LinkInternal } from "./ui/link";
import NounCard from "./NounCard";
import { Noun } from "@/lib/types";

interface AnimateGridProps {
    nouns: Noun[];
}

// export function FrozenRouter(props: { children: React.ReactNode }) {
//     const context = useContext(LayoutRouterContext ?? {});
//     const frozen = useRef(context).current;
//     const pathname = usePathname();

//     return (
//         <LayoutRouterContext.Provider value={frozen}>
//             <AnimatePresence mode="wait">
//                 <motion.div key={pathname}>{props.children}</motion.div>
//             </AnimatePresence>
//         </LayoutRouterContext.Provider>
//     );
// }

// export const FrozenRouter = ({ children }: { children: React.ReactNode }) => {
//     const context = useContext(LayoutRouterContext);
//     const [frozen, setFrozen] = useState(context);

//     const params = useSearchParams().toString();
//     const path = usePathname();
//     const prevPath = useRef(path);

//     useEffect(
//         () => {
//             // only unfreeze if the path hasn't changed
//             if (prevPath.current === path) {
//                 setFrozen(context);
//             }
//             prevPath.current = path;
//         },
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//         [params, path]
//     );
//     const memoizedContext = useMemo(() => ({ ...frozen, childNodes: context?.childNodes }), [frozen, context]);

//     return (
//         <LayoutRouterContext.Provider value={memoizedContext}>
//             <AnimatePresence mode="wait">
//                 <motion.div key={path}>{children}</motion.div>
//             </AnimatePresence>
//         </LayoutRouterContext.Provider>
//     );
// };

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
