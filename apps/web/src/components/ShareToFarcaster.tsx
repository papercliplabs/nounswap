import { Button } from "./ui/button";
import { Slottable } from "@radix-ui/react-slot";
import { LinkExternal } from "./ui/link";
import Image from "next/image";

interface ShareToFarcasterProps {
  text: string;
  embeds?: [string] | [string, string];
}

const BASE_COMPOSE_URL = "https://warpcast.com/~/compose";

export default function ShareToFarcaster({
  text,
  embeds,
}: ShareToFarcasterProps) {
  const searchParams = new URLSearchParams([
    ["text", text],
    ...(embeds ? embeds.map((embed) => ["embeds[]", embed]) : []),
  ]).toString();

  return (
    <Button asChild>
      <Slottable>
        <LinkExternal
          href={`${BASE_COMPOSE_URL}?${searchParams.toString()}`}
          className="flex items-center gap-3 label-md"
        >
          <Image
            src="/socials/farcaster.svg"
            width={20}
            height={20}
            className="h-[20px] w-[20px]"
            alt=""
          />
          Share to Farcaster
        </LinkExternal>
      </Slottable>
    </Button>
  );
}
