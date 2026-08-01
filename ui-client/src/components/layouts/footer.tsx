import Link from "next/link";
import { AtSign, ExternalLink, Globe, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FOOTER_LINKS, SOCIAL_LINKS } from "@/constants/navigation";

const socialIconMap = {
  github: ExternalLink,
  x: AtSign,
  facebook: Globe,
  linkedin: Share2,
  react: Globe,
} as const;

export default function Footer() {
  return (
    <footer>
      <div className="mx-auto h-full max-w-screen-xl">
        <Separator />
        <div className="mx-auto flex w-full flex-col items-center justify-center gap-4 px-3 py-4">
          <ul className="flex items-center gap-8 text-sm">
            {FOOTER_LINKS.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="hover:text-primary">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">
            &copy; 2024 Graduation thesis
          </p>
          <ul className="flex items-center gap-2">
            {SOCIAL_LINKS.map((item) => {
              const Icon =
                socialIconMap[item.icon as keyof typeof socialIconMap] ??
                ExternalLink;
              return (
                <li key={item.label}>
                  <Button variant="ghost" size="icon" asChild>
                    <Link
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={item.label}
                    >
                      <Icon className="size-5" />
                    </Link>
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </footer>
  );
}
