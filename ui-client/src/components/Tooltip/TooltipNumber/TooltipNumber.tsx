"use client";

import { useEffect, useState } from "react";
import numeral from "numeral";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  formatCurrency,
  formatCurrencyV2,
  checkFormatBalance,
  formatBigBalance,
} from "@/lib/utils";

interface Props {
  number: any;
  type?: "amount" | "balance" | "percent";
}

export default function TooltipNumber({ number, type = "balance" }: Props) {
  const [numberFormat, setNumberFormat] = useState<number | string>(0);
  const [numberSize, setNumberSize] = useState<string>("");

  useEffect(() => {
    const { number_format, number_size } = formatBigBalance(number);
    setNumberFormat(number_format);
    setNumberSize(number_size);
  }, [number, type]);

  if (type === "percent") {
    return (
      <span className="w-max">
        {checkFormatBalance(number) === "NaN" ? 0 : checkFormatBalance(number)}
      </span>
    );
  }

  const compactLabel =
    type === "amount" && number < 100000
      ? numeral(number).format("0,0.000000") === "NaN"
        ? number
        : numeral(number).format("0,0.000000")
      : `${
          numeral(numberFormat).format("0,0.00") === "NaN"
            ? numberFormat
            : numeral(numberFormat).format("0,0.00")
        }${numberSize}`;

  if (
    (numberSize && numberSize !== "K") ||
    checkFormatBalance(number) === "NaN"
  ) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="w-max cursor-default">{compactLabel}</span>
        </TooltipTrigger>
        <TooltipContent>{formatCurrency(number)}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <span className="w-max">
      {number > 1 ? formatCurrencyV2(number) : formatCurrency(number)}
    </span>
  );
}
