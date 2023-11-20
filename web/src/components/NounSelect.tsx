"use client";
import { Noun } from "../common/types";
import NounGrid from "./NounGrid";
import { useMemo, useState } from "react";
import NounFilter from "./NounFilter";
import { ImageData } from "@nouns/assets";

interface NounSelectProps {
    nouns: Noun[];
}

export default function NounSelect({ nouns }: NounSelectProps) {
    const [backgroundFilter, setBackgroundFilter] = useState<number>(-1);
    const [bodyFilter, setBodyFilter] = useState<number>(-1);
    const [accessoryFilter, setAccessoryFilter] = useState<number>(-1);
    const [headFilter, setHeadFilter] = useState<number>(-1);
    const [glassesFilter, setGlassesFilter] = useState<number>(-1);
    const [filterOpen, setFilterOpen] = useState<boolean>(false);

    let filteredNouns = useMemo(() => {
        return nouns.filter((noun) => {
            let backgroundMatch = backgroundFilter == -1 ? true : backgroundFilter == noun.seed.background;
            let bodyMatch = bodyFilter == -1 ? true : bodyFilter == noun.seed.body;
            let accessoryMatch = accessoryFilter == -1 ? true : accessoryFilter == noun.seed.accessory;
            let headMatch = headFilter == -1 ? true : headFilter == noun.seed.head;
            let glassesMatch = glassesFilter == -1 ? true : glassesFilter == noun.seed.glasses;

            return backgroundMatch && bodyMatch && accessoryMatch && headMatch && glassesMatch;
        });
    }, [nouns, backgroundFilter, bodyFilter, accessoryFilter, headFilter, glassesFilter]);

    const selectProps = useMemo(() => {
        return {
            background: {
                name: "Background",
                options: [
                    { name: "Background", value: -1 },
                    { name: "Cool", value: 0 },
                    { name: "Warm", value: 1 },
                ],
                onSelect: setBackgroundFilter,
            },
            body: {
                name: "Body",
                options: [
                    { name: "Body", value: -1 },
                    ...ImageData.images.bodies.map((item, i) => {
                        return { name: item.filename.substring(item.filename.indexOf("-") + 1), value: i };
                    }),
                ],
                onSelect: setBodyFilter,
            },
            accessory: {
                name: "Accessory",
                options: [
                    { name: "Accessory", value: -1 },
                    ...ImageData.images.accessories.map((item, i) => {
                        return { name: item.filename.substring(item.filename.indexOf("-") + 1), value: i };
                    }),
                ],
                onSelect: setAccessoryFilter,
            },
            head: {
                name: "Head",
                options: [
                    { name: "Head", value: -1 },
                    ...ImageData.images.heads.map((item, i) => {
                        return { name: item.filename.substring(item.filename.indexOf("-") + 1), value: i };
                    }),
                ],
                onSelect: setHeadFilter,
            },
            glasses: {
                name: "Glasses",
                options: [
                    { name: "Glasses", value: -1 },
                    ...ImageData.images.glasses.map((item, i) => {
                        return { name: item.filename.substring(item.filename.indexOf("-") + 1), value: i };
                    }),
                ],
                onSelect: setGlassesFilter,
            },
        };
    }, []);

    return (
        <div className="flex flex-col w-full gap-2">
            <div className="flex flex-row justify-between items-end pb-3">
                <button className="btn-secondary md:hidden" onClick={() => setFilterOpen(!filterOpen)}>
                    Filter
                </button>
                <div className="w-full flex justify-end">{filteredNouns.length} nouns</div>
            </div>
            <div className="flex flex-row gap-6 w-full">
                <NounFilter
                    backgroundFilterSelectProps={{ selectedValue: backgroundFilter, ...selectProps.background }}
                    bodyFilterSelectProps={{ selectedValue: bodyFilter, ...selectProps.body }}
                    accessoryFilterSelectProps={{ selectedValue: accessoryFilter, ...selectProps.accessory }}
                    headFilterSelectProps={{ selectedValue: headFilter, ...selectProps.head }}
                    glassesFilterSelectProps={{ selectedValue: glassesFilter, ...selectProps.glasses }}
                    isOpen={filterOpen}
                    onClose={() => setFilterOpen(false)}
                />
                <NounGrid nouns={filteredNouns} />
            </div>
        </div>
    );
}
