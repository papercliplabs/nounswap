"use client";
import { useState } from "react";
import Select, { SelectProps } from "./Select";
import { twMerge } from "tailwind-merge";
import Icon from "./Icon";

interface NounFilterProps {
    backgroundFilterSelectProps: SelectProps<number>;
    bodyFilterSelectProps: SelectProps<number>;
    accessoryFilterSelectProps: SelectProps<number>;
    headFilterSelectProps: SelectProps<number>;
    glassesFilterSelectProps: SelectProps<number>;
    isOpen: boolean; // Mobile only
    onClose: () => void;
    onClearAllFilters: () => void;
}

export default function NounFilter(props: NounFilterProps) {
    return (
        <>
            <div
                className={twMerge(
                    "flex-col bg-gray-200 p-6 gap-6 md:h-min md:w-[350px] md:rounded-3xl hidden md:flex fixed md:static w-full h-full top-0 left-0 z-50 md:z-0",
                    props.isOpen && "flex"
                )}
            >
                <div className="flex flex-row justify-between">
                    <h3>Filter</h3>
                    <button className="text-blue-500 hover:brightness-[85%]" onClick={props.onClearAllFilters}>
                        Clear all
                    </button>
                </div>
                <Select {...props.backgroundFilterSelectProps} />
                <Select {...props.bodyFilterSelectProps} />
                <Select {...props.accessoryFilterSelectProps} />
                <Select {...props.headFilterSelectProps} />
                <Select {...props.glassesFilterSelectProps} />
                <button className="btn-primary md:hidden mt-4 text-center justify-center" onClick={props.onClose}>
                    Done
                </button>
            </div>
        </>
    );
}
