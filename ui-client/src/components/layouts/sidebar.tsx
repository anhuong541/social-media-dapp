"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { MessageCircle, Radio, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NAV_ITEMS } from "@/constants/navigation";
import { cn } from "@/lib/utils";

const iconMap = {
  radio: Radio,
  "message-circle": MessageCircle,
  user: User,
} as const;

export default function SideBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { address } = useAccount();

  return (
    <nav className="hidden flex-col gap-2 border-r bg-background px-2 py-3 lg:flex">
      {NAV_ITEMS.map((item) => {
        const Icon = iconMap[item.icon];
        const href =
          item.href === "profile"
            ? address
              ? `/profile/${address}`
              : "#"
            : item.href;
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : item.href === "profile"
              ? pathname.startsWith("/profile")
              : pathname.startsWith(item.href);

        if (item.href === "profile") {
          return (
            <Button
              key={item.label}
              variant="ghost"
              className={cn(
                "justify-start gap-3",
                isActive && "bg-muted text-foreground"
              )}
              disabled={!address}
              onClick={() => address && router.push(`/profile/${address}`)}
            >
              <Icon className="size-5 text-primary" />
              {item.label}
            </Button>
          );
        }

        return (
          <Button
            key={item.label}
            variant="ghost"
            className={cn(
              "justify-start gap-3",
              isActive && "bg-muted text-foreground"
            )}
            asChild
          >
            <Link href={href}>
              <Icon className="size-5 text-primary" />
              {item.label}
            </Link>
          </Button>
        );
      })}
      <Separator className="my-2" />
    </nav>
  );
}
