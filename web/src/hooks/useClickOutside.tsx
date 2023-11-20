"use client";
import { RefObject, useEffect } from "react";

interface UseClickOutsideParams {
    ref: RefObject<HTMLElement>;
    onClickOutside: () => void;
}

export default function useClickOutside({ ref, onClickOutside }: UseClickOutsideParams) {
    useEffect(() => {
        function handleClickOutside(event: any) {
            if (ref.current && !ref.current.contains(event.target)) {
                onClickOutside();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mouseDown", handleClickOutside);
        };
    }, [ref, onClickOutside]);
}
