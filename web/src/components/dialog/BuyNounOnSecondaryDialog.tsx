"use client";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import ProgressCircle from "../ProgressCircle";
import { Dialog, DialogContent } from "../ui/dialogBase";
import { Button } from "../ui/button";
import { twMerge } from "tailwind-merge";
import { useAccount, useBalance, useWalletClient } from "wagmi";
import { Noun } from "@/data/noun/types";
import Icon from "../ui/Icon";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { getBuyNounOnSecondaryPayload } from "@/data/noun/getBuyNounOnSecondaryPayload";
import { useQuery } from "@tanstack/react-query";
import ConvertNounGraphic from "../ConvertNounGraphic";
import { formatNumber } from "@/utils/format";
import { formatEther } from "viem";
import { CHAIN_CONFIG, reservoirClient } from "@/config";
import { APIError, Execute } from "@reservoir0x/reservoir-sdk";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useSwitchChainCustom } from "@/hooks/useSwitchChainCustom";
import LoadingSpinner from "../LoadingSpinner";
import { TransactionListenerContext } from "@/providers/TransactionListener";
import { useRouter } from "next/navigation";
import { forceAllNounRevalidation } from "@/data/noun/getAllNouns";
import { revalidateTag } from "next/cache";
import { revalidateSecondaryNounListings } from "@/data/noun/getSecondaryNounListings";

interface BuyOnSecondaryDialogProps {
  noun: Noun;
}

export default function BuyNounOnSecondaryDialog({ noun }: BuyOnSecondaryDialogProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [step, setStep] = useState<0 | 1>(0);
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { switchChain } = useSwitchChainCustom();
  const { openConnectModal } = useConnectModal();
  const [error, setError] = useState<string | undefined>(undefined);
  const [pending, setPending] = useState<boolean>(false);
  const router = useRouter();
  const { addTransaction } = useContext(TransactionListenerContext);

  const { data: secondaryListingData } = useQuery({
    queryKey: ["getBuyNounOnSecondaryPayload", noun.secondaryListing?.orderId, address],
    queryFn: () => getBuyNounOnSecondaryPayload(noun.secondaryListing!.orderId, address!),
    enabled: address != undefined && noun.secondaryListing != null,
  });

  const { data: balanceData } = useBalance({ address });
  const insufficientFunds = useMemo(() => {
    if (noun.secondaryListing?.priceRaw == undefined || balanceData == undefined) {
      return false;
    } else {
      return balanceData.value < BigInt(noun.secondaryListing.priceRaw);
    }
  }, [balanceData, noun]);

  useEffect(() => {
    if (secondaryListingData) {
      console.log(secondaryListingData);
      setStep(secondaryListingData.step == "sign-in" ? 0 : 1);
    }
  }, [secondaryListingData]);

  const executePurchaseStep = useCallback(async () => {
    if (!address || !walletClient) {
      openConnectModal?.();
    } else if (noun.secondaryListing) {
      // Call all the time
      const correctChain = await switchChain({ chainId: CHAIN_CONFIG.chain.id });
      if (!correctChain) return;

      // Trigger reservoir steps
      try {
        await reservoirClient.actions.buyToken({
          items: [{ orderId: noun.secondaryListing.orderId }],
          // items: [{ orderId: "0xf9eca7fee92b270a71e31cc08eb85aa6dd957a6fd7196eee34a94c85b88a9f25" }], // Blur lil Noun
          // items: [{ orderId: "0xc4aea0198927a5a92b11122699a2250272d483e9887b034c1b11fce4ca980d30" }], // Open sea lil Noun
          wallet: walletClient,
          options: {
            skipBalanceCheck: true,
          },
          onProgress: (steps: Execute["steps"]) => {
            setPending(true);

            const firstStep = steps.length > 0 ? steps[0] : undefined;
            const secondStep = steps.length > 1 ? steps[1] : undefined;

            const authStep = firstStep?.id == "auth" ? firstStep : undefined;
            const purchaseStep = firstStep?.id == "auth" ? secondStep : firstStep;

            if (step == 0 && (!authStep || authStep?.items?.[0].status == "complete")) {
              setStep(1);
              setPending(false);
            }

            if (purchaseStep?.items?.[0].txHashes?.[0].txHash) {
              addTransaction?.(
                purchaseStep.items[0].txHashes[0].txHash,
                {
                  type: "secondary-purchase",
                  description: `Purchase Noun ${noun.id}`,
                },
                () => {
                  setPending(false);
                  revalidateSecondaryNounListings();
                  router.push("/");
                }
              );
            }
          },
        });
      } catch (e) {
        setPending(false);
        console.error(`Reservoir error ${e}`);
        setError((e as APIError).message);
      }
    }
  }, [address, walletClient, openConnectModal, noun.secondaryListing, step]);

  const progressStepper = useMemo(
    () => (
      <div className="text-content-secondary flex w-full flex-col items-center justify-center gap-3 pt-3">
        {step != undefined && (
          <>
            <div className="paragraph-sm flex w-full flex-row items-center justify-center gap-3 px-10 pb-8">
              <div className="relative">
                <ProgressCircle state={step == 0 ? "active" : "completed"} />
                <div className="text-semantic-accent absolute top-6 w-fit -translate-x-[calc(50%-6px)] whitespace-nowrap">
                  Sign In
                </div>
              </div>
              <div className={twMerge("bg-background-disabled h-1 w-1/3", step > 0 && "bg-semantic-accent")} />
              <div className="relative">
                <ProgressCircle state={step == 0 ? "todo" : step == 1 ? "active" : "completed"} />
                <div
                  className={twMerge(
                    "absolute top-6 w-fit -translate-x-[calc(50%-6px)] whitespace-nowrap",
                    step > 0 && "text-semantic-accent"
                  )}
                >
                  Purchase
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    ),
    [step]
  );

  useEffect(() => {
    if (!open) {
      setError(undefined);
    }
  }, [open]);

  useEffect(() => {
    if (!address) {
      setStep(0);
    }
  }, [address]);

  const listing = noun.secondaryListing;
  if (!listing) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Icon icon="lightning" size={20} className="fill-white" />
          Buy Noun
        </Button>
      </DialogTrigger>
      <DialogContent
        className="flex max-h-[80vh] max-w-[425px] flex-col overflow-y-auto pt-12"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <div className="flex flex-col items-center justify-center gap-6">
          <ConvertNounGraphic
            noun={noun}
            action="redeem"
            scale={1}
            asset="eth"
            amount={formatNumber({ input: Number(formatEther(BigInt(listing.priceRaw))), unit: "Ξ" })}
          />
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <h4>{step == 0 ? "Sign into marketplace" : "Confirm Purchase"}</h4>
            <span className="text-content-secondary">
              {step == 0
                ? `Before a purchase can be made, a message must be signed to sign into ${listing.marketName}.`
                : `This will purchase Noun ${noun.id} for ${formatNumber({ input: Number(formatEther(BigInt(listing.priceRaw ?? BigInt(0)))), unit: "ETH" })} on secondary.`}
            </span>
          </div>
          {progressStepper}
          <div className="flex w-full flex-col gap-1">
            <Button onClick={executePurchaseStep} className="w-full" disabled={insufficientFunds || pending}>
              {pending ? (
                <div>
                  <LoadingSpinner size={24} />
                </div>
              ) : step == 0 ? (
                "Sign In"
              ) : (
                "Purchase"
              )}
            </Button>
            <span className="paragraph-sm text-semantic-negative max-h-[100px] overflow-y-auto">
              {insufficientFunds ? "Insufficient Funds" : error}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
