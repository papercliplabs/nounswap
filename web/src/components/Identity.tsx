"use client";
import { cn } from "@paperclip-labs/dapp-kit";
import { Avatar, Name } from "@paperclip-labs/dapp-kit/identity";
import { GetIdentityParameters } from "node_modules/@paperclip-labs/dapp-kit/dist/identity/shared/types";
import { HTMLAttributes } from "react";
import { Address } from "viem";

export const IDENTITY_RESOLVERS: GetIdentityParameters["resolvers"] = ["nns", "ens", "farcaster"];

interface IdentityProps extends HTMLAttributes<HTMLDivElement> {
  address: Address;
  avatarSize: number;
}

export default function Identity({ address, avatarSize, className, ...props }: IdentityProps) {
  return (
    <div className={cn("flex items-center gap-1 font-bold", className)} {...props}>
      <Avatar address={address} size={avatarSize} resolvers={IDENTITY_RESOLVERS} />
      <Name address={address} resolvers={IDENTITY_RESOLVERS} />
    </div>
  );
}
