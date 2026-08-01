"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CopyProps {
  textToCopy: string;
}

export default function CopyAddress({ textToCopy }: CopyProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess(true);
    } catch {
      setCopySuccess(false);
    }
  };

  useEffect(() => {
    if (!copySuccess) return;
    const timer = setTimeout(() => setCopySuccess(false), 3000);
    return () => clearTimeout(timer);
  }, [copySuccess]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={copyToClipboard}
          aria-label="Copy address"
        >
          {copySuccess ? (
            <Check className="size-3.5 text-primary" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {copySuccess ? "Copied" : "Copy address"}
      </TooltipContent>
    </Tooltip>
  );
}
