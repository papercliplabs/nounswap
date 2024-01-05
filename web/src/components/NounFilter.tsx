"use client";
import { twMerge } from "tailwind-merge";
import { useSearchParams } from "next/navigation";
import useUpdateSearchParams from "@/hooks/useUpdateSearchParam";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageData } from "@nouns/assets";
import { NounFeatureFilterOption } from "@/lib/types";

export default function NounFilter() {
    const updateSearchParams = useUpdateSearchParams();

    return (
        <div
            className={twMerge(
                "flex-col bg-secondary p-6 gap-6 md:h-min md:w-[350px] md:rounded-3xl hidden md:flex fixed md:static w-full h-full top-0 left-0 z-50 md:z-0"
            )}
        >
            <div className="flex flex-row justify-between">
                <h3>Filter</h3>
                <button
                    className="text-accent hover:brightness-[85%]"
                    onClick={() => {
                        updateSearchParams([
                            { name: NounFeatureFilterOption.Head, value: null },
                            { name: NounFeatureFilterOption.Glasses, value: null },
                            { name: NounFeatureFilterOption.Accessory, value: null },
                            { name: NounFeatureFilterOption.Body, value: null },
                            { name: NounFeatureFilterOption.Background, value: null },
                        ]);
                    }}
                >
                    Clear all
                </button>
            </div>
            <FilterSelect
                name={NounFeatureFilterOption.Head}
                options={ImageData.images.heads
                    .map((item, i) => {
                        return { name: item.filename.substring(item.filename.indexOf("-") + 1), value: i.toString() };
                    })
                    .sort((itemA, itemB) => (itemA.name > itemB.name ? 1 : -1))}
            />
            <FilterSelect
                name={NounFeatureFilterOption.Glasses}
                options={ImageData.images.glasses
                    .map((item, i) => {
                        return { name: item.filename.substring(item.filename.indexOf("-") + 1), value: i.toString() };
                    })
                    .sort((itemA, itemB) => (itemA.name > itemB.name ? 1 : -1))}
            />
            <FilterSelect
                name={NounFeatureFilterOption.Accessory}
                options={ImageData.images.accessories
                    .map((item, i) => {
                        return { name: item.filename.substring(item.filename.indexOf("-") + 1), value: i.toString() };
                    })
                    .sort((itemA, itemB) => (itemA.name > itemB.name ? 1 : -1))}
            />
            <FilterSelect
                name={NounFeatureFilterOption.Body}
                options={ImageData.images.bodies
                    .map((item, i) => {
                        return { name: item.filename.substring(item.filename.indexOf("-") + 1), value: i.toString() };
                    })
                    .sort((itemA, itemB) => (itemA.name > itemB.name ? 1 : -1))}
            />
            <FilterSelect
                name={NounFeatureFilterOption.Background}
                options={[
                    { name: "cool", value: "0" },
                    { name: "warm", value: "1" },
                ]}
            />
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

    return (
        <Select
            onValueChange={(value) => updateSearchParams([{ name, value: value == "none" ? null : value }])}
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
                    {name}
                </div>
                <SelectValue placeholder={name} asChild>
                    <h6>{value == "none" ? name : options.find((option) => option.value == value)?.name}</h6>
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value={"none"} className="hover:bg-secondary">
                        {name}
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
