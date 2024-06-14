import { Noun } from "@/data/noun/types";
import NounCard from "./NounCard";
import Icon from "./ui/Icon";
import Image from "next/image";

interface ConvertNounGraphicProps {
  noun: Noun;
  action: "deposit" | "redeem";
  scale?: number;
}

export default function ConvertNounGraphic({ noun, action, scale }: ConvertNounGraphicProps) {
  return (
    <div className="flex flex-row gap-5" style={{ scale: scale }}>
      <div className="relative">
        {action === "deposit" ? <NounCard noun={noun} size={80} enableHover={false} /> : <Erc20Card />}
        <div className="absolute right-0 top-1/2 z-40 -translate-y-1/2 translate-x-[calc(50%+10px)]">
          <Icon icon={"swap"} size={36} className="bg-background-secondary rounded-full border-2 border-white p-2" />
        </div>
      </div>
      {action === "redeem" ? <NounCard noun={noun} size={80} enableHover={false} /> : <Erc20Card />}
    </div>
  );
}

function Erc20Card() {
  return (
    <div className="bg-background-secondary flex h-[80px] w-[80px] items-center justify-center rounded-[12px]">
      <Image src="/nouns-treasury.png" width={100} height={100} alt="" className="h-[43px] w-[43px]" />
    </div>
  );
}
