"use client";

import { useSearchParams } from "next/navigation";
import { Dialog, DialogContent } from "../ui/dialogBase";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import Image from "next/image";
import { Noun, NounTrait } from "@/data/noun/types";
import { Separator } from "../ui/separator";
import { useMemo } from "react";
import { CHAIN_CONFIG } from "@/config";
import { getUserForAddress } from "@/data/user/getUser";
import { CustomAvatar } from "@/providers/WalletProvider";
import Link from "next/link";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import HowItWorksDialog from "./HowItWorksDialog";

interface NounsDialogProps {
  nouns: Noun[];
}

export default function NounDialog({ nouns }: NounsDialogProps) {
  const searchParams = useSearchParams();
  const nounId = searchParams.get("nounId");

  const noun = useMemo(() => {
    return nounId ? nouns.find((noun) => noun.id === nounId) : undefined;
  }, [nouns, nounId]);

  const { data: user } = useQuery({
    queryKey: ["user-query", noun?.owner],
    queryFn: () => getUserForAddress(noun?.owner!),
    enabled: noun != undefined,
  });

  function handleOpenChange(open: boolean) {
    if (!open) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("nounId");
      window.history.pushState(null, "", `?${params.toString()}`);
    }
  }

  const heldByTreasury = useMemo(() => {
    return noun?.owner == CHAIN_CONFIG.addresses.nounsTreasury;
  }, [noun]);

  if (!noun) {
    console.error("NounDialog - no noun found", nounId);
    return null;
  }

  return (
    <Dialog open={nounId != undefined} onOpenChange={handleOpenChange}>
      <DialogContent
        className={clsx(
          "w-[95vw] max-w-[1200px] px-0 pb-0 pt-[70px]",
          noun.traits.background.seed == 1 ? "bg-nouns-warm" : "bg-nouns-cool"
        )}
      >
        <div className="flex max-h-[70vh] flex-col gap-6 overflow-y-auto px-6 pb-6 pt-0 md:flex-row md:overflow-hidden md:px-12 md:pb-0">
          <div className="flex flex-[5] justify-center">
            <Image
              src={noun.imageSrc}
              width={600}
              height={600}
              alt=""
              unoptimized={noun == undefined}
              className="h-full max-h-[500px] w-full max-w-[500px] object-contain object-top"
            />
          </div>
          <div className="flex flex-[7] flex-col gap-6 overflow-visible pb-6 pr-2 md:overflow-y-auto">
            <h1>Noun {noun.id}</h1>

            <Separator className="h-[2px]" />

            <div className="flex items-center gap-6">
              <CustomAvatar address={noun.owner} ensImage={user?.imageSrc} size={40} />
              <div className="flex h-full flex-col justify-start">
                <span className="paragraph-sm text-content-secondary">Held by</span>
                <span className="label-md">
                  {user ? user.name : <Skeleton className="w-[200px] whitespace-pre-wrap"> </Skeleton>}{" "}
                </span>
              </div>
            </div>

            {heldByTreasury && (
              <>
                <Link href={`/swap/${noun!.id}`}>
                  <Button className="w-full">Create a swap offer</Button>
                </Link>
                <div className="text-content-secondary">
                  You can create a swap offer for this Noun.{" "}
                  <HowItWorksDialog>
                    <span className="text-semantic-accent">
                      <button>Learn More</button>
                    </span>
                  </HowItWorksDialog>
                </div>
              </>
            )}

            <Separator className="h-[2px]" />

            <div className="flex flex-col gap-4">
              <h5>Traits</h5>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <NounTraitCard type="Head" trait={noun?.traits.head} />
                <NounTraitCard type="Glasses" trait={noun?.traits.glasses} />
                <NounTraitCard type="Body" trait={noun?.traits.body} />
                <NounTraitCard type="Accessory" trait={noun?.traits.accessory} />
                <NounTraitCard type="Background" trait={noun?.traits.background} />
              </div>
            </div>

            <Separator className="h-[2px]" />

            <span className="paragraph-sm text-content-secondary">One Noun, Every Day, Forever.</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function NounTraitCard({ type, trait }: { type: string; trait?: NounTrait }) {
  return (
    <div className="flex gap-4 rounded-xl bg-black/5 p-2">
      {trait ? (
        <Image src={trait.imageSrc ?? ""} width={48} height={48} alt="" className="h-12 w-12 rounded-lg" />
      ) : (
        <Skeleton className="h-12 w-12 rounded-lg" />
      )}
      <div className="flex flex-col">
        <span className="paragraph-sm text-content-secondary">{type}</span>
        <span className="label-md">
          {trait?.name
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </span>
      </div>
    </div>
  );
}
