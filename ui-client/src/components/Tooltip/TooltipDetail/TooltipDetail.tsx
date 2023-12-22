"use client";

interface Props {
  text: string | number;
  link?: string;
}

export default function TooltipDetail({ text, link }: Props) {
  return (
    <div className="relative px-2 py-1 text-xs text-white normal-case bg-black rounded w-max">
      {link && link.length !== 0 ? (
        <>
          {text}
          <a
            href={link}
            target="_blank"
            className="text-white cursor-pointer hover:text-blue-500"
          >
            Learn more
          </a>
        </>
      ) : (
        <>{text}</>
      )}
    </div>
  );
}
