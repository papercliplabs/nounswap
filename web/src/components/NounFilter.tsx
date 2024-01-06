"use client";
import { twMerge } from "tailwind-merge";
import { useSearchParams } from "next/navigation";
import useUpdateSearchParams from "@/hooks/useUpdateSearchParam";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageData } from "@nouns/assets";
import { NounFeatureFilterOption } from "@/lib/types";
import { Suspense, useMemo } from "react";
import ClearNounFiltersButton from "./ClearNounFiltersButton";

export default function NounFilter() {
    return (
        <div
            className={twMerge(
                "flex-col bg-secondary p-6 gap-6 md:h-min md:w-[350px] md:rounded-3xl hidden md:flex fixed md:static w-full h-full top-0 left-0 z-50 md:z-0 shrink-0"
            )}
        >
            <div className="flex flex-row justify-between">
                <h3>Filter</h3>
                <Suspense>
                    <ClearNounFiltersButton />
                </Suspense>
            </div>
            <Suspense>
                <FilterSelect
                    name={NounFeatureFilterOption.Head}
                    options={ImageData.images.heads
                        .map((item, i) => {
                            return {
                                name: item.filename.substring(item.filename.indexOf("-") + 1),
                                value: i.toString(),
                            };
                        })
                        .sort((itemA, itemB) => (itemA.name > itemB.name ? 1 : -1))}
                />
            </Suspense>

            <Suspense>
                <FilterSelect
                    name={NounFeatureFilterOption.Glasses}
                    options={ImageData.images.glasses
                        .map((item, i) => {
                            return {
                                name: item.filename.substring(item.filename.indexOf("-") + 1),
                                value: i.toString(),
                            };
                        })
                        .sort((itemA, itemB) => (itemA.name > itemB.name ? 1 : -1))}
                />
            </Suspense>

            <Suspense>
                <FilterSelect
                    name={NounFeatureFilterOption.Accessory}
                    options={ImageData.images.accessories
                        .map((item, i) => {
                            return {
                                name: item.filename.substring(item.filename.indexOf("-") + 1),
                                value: i.toString(),
                            };
                        })
                        .sort((itemA, itemB) => (itemA.name > itemB.name ? 1 : -1))}
                />
            </Suspense>

            <Suspense>
                <FilterSelect
                    name={NounFeatureFilterOption.Body}
                    options={ImageData.images.bodies
                        .map((item, i) => {
                            return {
                                name: item.filename.substring(item.filename.indexOf("-") + 1),
                                value: i.toString(),
                            };
                        })
                        .sort((itemA, itemB) => (itemA.name > itemB.name ? 1 : -1))}
                />
            </Suspense>

            <Suspense>
                <FilterSelect
                    name={NounFeatureFilterOption.Background}
                    options={[
                        { name: "cool", value: "0" },
                        { name: "warm", value: "1" },
                    ]}
                />
            </Suspense>
        </div>
    );
}

interface FilterSelectProps {
    name: string;
    options: {
        name: string;
        value: string;
    }[];
}

function FilterSelect({ name, options }: FilterSelectProps) {
    const searchParams = useSearchParams();
    const updateSearchParams = useUpdateSearchParams();
    const value = searchParams.get(name) ?? "none";

    const displayName = useMemo(() => {
        return name.charAt(0).toUpperCase() + name.substring(1);
    }, [name]);

    return (
        <Select
            onValueChange={(value) => updateSearchParams([{ name, value: value == "none" ? null : value }], true)}
            value={value}
        >
            <SelectTrigger
                className={twMerge(
                    "w-full rounded-xl font-sans p-4 h-fit relative",
                    value == "none" && "text-secondary"
                )}
            >
                <div
                    className={twMerge(
                        "text-caption absolute left-4 top-0 -translate-y-1/2 text-secondary backdrop-blur-sm transition-all duration-75 pointer-events-none font-londrina",
                        value == "none" && "top-1/2 opacity-0"
                    )}
                >
                    {displayName}
                </div>
                <SelectValue placeholder={displayName} asChild>
                    <h6>{value == "none" ? displayName : options.find((option) => option.value == value)?.name}</h6>
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value={"none"} className="hover:bg-secondary">
                        {displayName}
                    </SelectItem>
                    {options.map((option, i) => (
                        <SelectItem value={option.value.toString()} key={i}>
                            {option.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
