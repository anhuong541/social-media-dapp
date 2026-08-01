"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  text: string | number;
  link?: string;
}

export default function TooltipDetail({ text, link }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-default">{text}</span>
      </TooltipTrigger>
      <TooltipContent>
        {link && link.length !== 0 ? (
          <>
            {text}{" "}
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-primary"
            >
              Learn more
            </a>
          </>
        ) : (
          <>{text}</>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
