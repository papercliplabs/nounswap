import { getUserName } from "@/data/user/getUserName";
import { HTMLAttributes, Suspense } from "react";
import { Address } from "viem";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/utils/shadcn";
import { getUserAvatar } from "@/data/user/getUserAvatar";
import Image from "next/image";
import { getLinearGradientForAddress } from "@/utils/utils";

export function UserNameComponent({ name, className, ...props }: HTMLAttributes<HTMLDivElement> & { name?: string }) {
  return (
    <span className={cn("overflow-hidden overflow-ellipsis whitespace-nowrap", className)} {...props}>
      {name ?? <Skeleton className="h-fit w-[140px] whitespace-pre-wrap"> </Skeleton>}
    </span>
  );
}

export function UserAvatarComponent({
  address,
  imgSrc,
  imgSize,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { address: Address; imgSrc?: string; imgSize: number }) {
  return imgSrc ? (
    <Image
      src={imgSrc}
      width={imgSize ?? 36}
      height={imgSize ?? 36}
      alt=""
      className={cn("border-border-primary h-[36px] w-[36px] shrink-0 rounded-full border", className)}
      {...props}
    />
  ) : (
    <div
      className={cn("h-[36px] w-[36px] shrink-0 rounded-full", className)}
      style={{
        background: getLinearGradientForAddress(address),
      }}
      {...props}
    />
  );
}

interface UserProps extends HTMLAttributes<HTMLDivElement> {
  address: Address;
}

export async function UserName({ address, ...props }: UserProps) {
  return (
    <Suspense fallback={<UserNameComponent name={undefined} {...props} />}>
      <UserNameFetcher address={address} {...props} />
    </Suspense>
  );
}

async function UserNameFetcher({ address, ...props }: UserProps) {
  const name = await getUserName(address);

  return <UserNameComponent name={name} {...props} />;
}

export async function UserAvatar({ address, imgSize, ...props }: UserProps & { imgSize: number }) {
  return (
    <Suspense fallback={<UserAvatarComponent address={address} imgSrc={undefined} imgSize={imgSize} {...props} />}>
      <UserAvatarFetcher address={address} imgSize={imgSize} {...props} />
    </Suspense>
  );
}

async function UserAvatarFetcher({ address, imgSize, ...props }: UserProps & { imgSize: number }) {
  const avatar = await getUserAvatar(address);

  return <UserAvatarComponent address={address} imgSrc={avatar ?? undefined} imgSize={imgSize} {...props} />;
}
