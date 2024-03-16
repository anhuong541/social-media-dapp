"use client";

import { useEffect, useState } from "react";
import numeral from "numeral";
import TooltipDetail from "../TooltipDetail/TooltipDetail";
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
  const [isShowTooltip, setIsShowTooltip] = useState<boolean>(false);

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

  return (
    <span className="w-max">
      {(numberSize && numberSize !== "K") ||
      checkFormatBalance(number) === "NaN" ? (
        <span
          onMouseOver={() => {
            setIsShowTooltip(true);
          }}
          onMouseLeave={() => {
            setIsShowTooltip(false);
          }}
          className="relative"
        >
          {type === "amount" && number < 100000 ? (
            <span>
              {numeral(number).format("0,0.000000") === "NaN"
                ? number
                : numeral(number).format("0,0.000000")}
            </span>
          ) : (
            <span>
              <span>
                {numeral(numberFormat).format("0,0.00") === "NaN"
                  ? numberFormat
                  : numeral(numberFormat).format("0,0.00")}
              </span>
              <span>{numberSize}</span>
            </span>
          )}

          {isShowTooltip && (
            <div
              className="absolute -left-[50%] -top-8"
              style={{ zIndex: "2147483648" }}
            >
              <TooltipDetail text={formatCurrency(number)} />
            </div>
          )}
        </span>
      ) : (
        <span>
          {number > 1 ? formatCurrencyV2(number) : formatCurrency(number)}
        </span>
      )}
    </span>
  );
}
