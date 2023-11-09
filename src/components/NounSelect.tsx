"use client";
import { Noun } from "@/common/types";
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

    let filteredNouns = useMemo(() => {
        return nouns.filter((noun) => {
            let backgroundMatch = backgroundFilter == -1 ? true : backgroundFilter == noun.seed.background;
            let bodyMatch = bodyFilter == -1 ? true : bodyFilter == noun.seed.body;
            let accessoryMatch = accessoryFilter == -1 ? true : accessoryFilter == noun.seed.accessory;
            let headMatch = headFilter == -1 ? true : accessoryFilter == noun.seed.accessory;
            let glassesMatch = glassesFilter == -1 ? true : glassesFilter == noun.seed.glasses;

            return backgroundMatch && bodyMatch && accessoryMatch && headMatch && glassesMatch;
        });
    }, [nouns, backgroundFilter, bodyFilter, accessoryFilter, headFilter, glassesFilter]);

    const selectProps = useMemo(() => {
        return {
            background: {
                name: "Background",
                options: [
                    { name: "Any", value: -1 },
                    { name: "Cool", value: 0 },
                    { name: "Warm", value: 1 },
                ],
                onSelect: setBackgroundFilter,
            },
            body: {
                name: "Body",
                options: [
                    { name: "Any", value: -1 },
                    ...ImageData.images.bodies.map((item, i) => {
                        return { name: item.filename.substring(item.filename.indexOf("-") + 1), value: i };
                    }),
                ],
                onSelect: setBodyFilter,
            },
            accessory: {
                name: "Accessory",
                options: [
                    { name: "Any", value: -1 },
                    ...ImageData.images.accessories.map((item, i) => {
                        return { name: item.filename.substring(item.filename.indexOf("-") + 1), value: i };
                    }),
                ],
                onSelect: setAccessoryFilter,
            },
            head: {
                name: "Head",
                options: [
                    { name: "Any", value: -1 },
                    ...ImageData.images.heads.map((item, i) => {
                        return { name: item.filename.substring(item.filename.indexOf("-") + 1), value: i };
                    }),
                ],
                onSelect: setHeadFilter,
            },
            glasses: {
                name: "Glasses",
                options: [
                    { name: "Any", value: -1 },
                    ...ImageData.images.glasses.map((item, i) => {
                        return { name: item.filename.substring(item.filename.indexOf("-") + 1), value: i };
                    }),
                ],
                onSelect: setGlassesFilter,
            },
        };
    }, []);

    return (
        <div className="flex flex-row ">
            <NounFilter
                backgroundFilterSelectProps={{ selectedValue: backgroundFilter, ...selectProps.background }}
                bodyFilterSelectProps={{ selectedValue: bodyFilter, ...selectProps.body }}
                accessoryFilterSelectProps={{ selectedValue: accessoryFilter, ...selectProps.accessory }}
                headFilterSelectProps={{ selectedValue: headFilter, ...selectProps.head }}
                glassesFilterSelectProps={{ selectedValue: glassesFilter, ...selectProps.glasses }}
            />
            <NounGrid nouns={filteredNouns} />
        </div>
    );
}
