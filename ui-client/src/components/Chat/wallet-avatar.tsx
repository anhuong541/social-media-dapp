"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DEFAULT_AVATAR_SRC } from "@/constants/app";
import { cn, truncateAddress } from "@/lib/utils";

type WalletAvatarProps = {
  address?: string | null;
  className?: string;
  size?: "default" | "sm" | "lg";
};

export function WalletAvatar({
  address,
  className,
  size = "default",
}: WalletAvatarProps) {
  const label = address ? truncateAddress(address).slice(0, 2).toUpperCase() : "?";

  return (
    <Avatar size={size} className={cn(className)}>
      <AvatarImage src={DEFAULT_AVATAR_SRC} alt={address ?? "wallet"} />
      <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
        {label}
      </AvatarFallback>
    </Avatar>
  );
}
