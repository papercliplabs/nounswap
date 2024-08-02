"use client";
import { Address } from "viem";
import { LinkExternal } from "../ui/link";
import { useQueries } from "@tanstack/react-query";
import { CHAIN_CONFIG } from "@/config";
import { HTMLAttributes, ReactNode, createContext, useContext, useMemo } from "react";
import { cn } from "@/utils/shadcn";
import { UserAvatarComponent, UserNameComponent } from ".";
import { userAvatarQuery, userNameQuery } from "@/data/tanstackQueries";

interface UserContextType {
  address?: Address;
  name?: string;
  avatarImgSrc?: string;
}

export const UserContext = createContext<UserContextType>({});

interface UserProps extends Omit<React.ComponentProps<typeof LinkExternal>, "href"> {
  address?: Address;
  disableLink?: boolean;
  children: ReactNode;
}

export function UserRoot({ address, disableLink, children, className, ...props }: UserProps) {
  const [{ data: name }, { data: avatar }] = useQueries({
    queries: [
      {
        ...userNameQuery(address),
        enabled: address != undefined,
      },
      {
        ...userAvatarQuery(address),
        enabled: address != undefined,
      },
    ],
  });

  const linkDisabled = useMemo(() => disableLink || address == undefined, [disableLink, address]);

  return (
    <UserContext.Provider value={{ address, name: name ?? undefined, avatarImgSrc: avatar ?? undefined }}>
      {linkDisabled ? (
        <div className={cn("flex min-w-0 items-center gap-2", className)}>{children}</div>
      ) : (
        <LinkExternal
          className={cn("flex min-w-0 items-center gap-2", "hover:brightness-75", className)}
          href={`${CHAIN_CONFIG.chain.blockExplorers?.default.url}/address/${address}`}
          {...props}
        >
          {children}
        </LinkExternal>
      )}
    </UserContext.Provider>
  );
}

export function UserAvatar({ className, imgSize, ...props }: HTMLAttributes<HTMLDivElement> & { imgSize?: number }) {
  const { address, avatarImgSrc } = useContext(UserContext);

  return <UserAvatarComponent address={address!} imgSrc={avatarImgSrc} imgSize={imgSize ?? 36} className={className} />;
}

export function UserName({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const { name } = useContext(UserContext);

  return <UserNameComponent name={name} {...props} />;
}
