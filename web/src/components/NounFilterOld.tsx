"use client";
import { useState } from "react";
import Select, { SelectProps } from "./Select";
import { twMerge } from "tailwind-merge";
import Icon from "./ui/Icon";
import { Button } from "./ui/button";

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
          "fixed left-0 top-0 z-50 hidden h-full w-full flex-col gap-6 bg-background-secondary p-6 md:static md:z-0 md:flex md:h-min md:w-[350px] md:rounded-3xl",
          props.isOpen && "flex"
        )}
      >
        <div className="flex flex-row justify-between">
          <h3>Filter</h3>
          <button className="text-semantic-accent hover:brightness-[85%]" onClick={props.onClearAllFilters}>
            Clear all
          </button>
        </div>
        <Select {...props.backgroundFilterSelectProps} />
        <Select {...props.bodyFilterSelectProps} />
        <Select {...props.accessoryFilterSelectProps} />
        <Select {...props.headFilterSelectProps} />
        <Select {...props.glassesFilterSelectProps} />
        <Button className="mt-4 justify-center text-center md:hidden" onClick={props.onClose}>
          Done
        </Button>
      </div>
    </>
  );
}
