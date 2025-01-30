import { Address } from "viem";
import { LinkExternal } from "./ui/link";
import { getExplorerLink } from "@/utils/blockExplorer";
import { Avatar, Name } from "@paperclip-labs/whisk-sdk/identity";
import { HTMLAttributes } from "react";
import { cn } from "@paperclip-labs/whisk-sdk";

interface IdentityExplorerLinkProps extends HTMLAttributes<HTMLDivElement> {
  address: Address;
  showAvatar?: boolean;
  avatarSize?: number;
}

export function IdentityExplorerLink({
  address,
  showAvatar,
  avatarSize,
  className,
  ...props
}: IdentityExplorerLinkProps) {
  return (
    <LinkExternal
      href={getExplorerLink(address)}
      className={cn(
        "inline-flex flex-nowrap items-center gap-1 text-content-primary underline transition-all hover:text-content-primary/80",
        className,
      )}
    >
      {showAvatar && <Avatar address={address} size={avatarSize ?? 24} />}
      <Name address={address} />
    </LinkExternal>
  );
}
