"use client";
import { useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectValue } from "./ui/select";
import Image from "next/image";
import useUpdateSearchParams from "@/hooks/useUpdateSearchParam";

const chainOptions = [
    { name: "Ethereum Mainnet", imgSrc: "/ethereum-logo.png", chainId: 1 },
    { name: "Goerli Testnet", imgSrc: "/ethereum-testnet.png", chainId: 5 },
];

export default function ChainSelect() {
    const updateSearchParams = useUpdateSearchParams();
    const searchParams = useSearchParams();
    const selectedChain =
        chainOptions.find((option) => option.chainId.toString() == searchParams.get("chain")) ?? chainOptions[0];

    return (
        <Select
            value={selectedChain.chainId.toString()}
            onValueChange={(value) => updateSearchParams([{ name: "chain", value: value }])}
        >
            <SelectTrigger className="w-fit h-fit p-0 border-none" hideIcon>
                <Button variant="ghost" size="icon">
                    <Image src={selectedChain.imgSrc} width={32} height={32} alt="ETH" />
                </Button>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {chainOptions.map((option, i) => (
                        <SelectItem value={option.chainId.toString()} key={i}>
                            <div className="flex flex-row gap-2 items-center">
                                <Image src={option.imgSrc} width={32} height={32} alt="" />
                                <h6>{option.name}</h6>
                            </div>
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
