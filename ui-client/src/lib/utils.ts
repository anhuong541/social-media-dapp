import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import numeral from "numeral";
import crypto from "crypto";
import dayjs from "dayjs";

const durationex = require("dayjs/plugin/duration");
dayjs.extend(durationex);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function filterStatusID(data: any): any {
  let uniqueUpdates: { [key: string]: any } = {};

  for (const update of data) {
    const key = `${update.data.user}-${update.data.statusId._hex}`;
    if (
      !uniqueUpdates[key] ||
      parseInt(update.data.timestamp._hex, 16) >
        parseInt(uniqueUpdates[key].data.timestamp._hex, 16)
    ) {
      uniqueUpdates[key] = update;
    }
  }

  // add delete at this filter function
  return Object.values(uniqueUpdates).filter(
    (item) => item.data.newStatus !== "deleted_status_@"
  );
}

export function formatHexToDecimal(hexNumber: string): number {
  // Ensure the input is a string
  hexNumber = String(hexNumber);

  // Parse the hexadecimal number to decimal
  const decimalNumber: number = parseInt(hexNumber, 16);

  return decimalNumber;
}

// format time with input is hexNumber
export function formatDateTimeHex(timestampHex: string): string {
  // Convert hex timestamp to decimal
  const timestamp = parseInt(timestampHex, 16) * 1000;
  const now = Date.now();
  const timeDifference = now - timestamp;

  if (timeDifference >= 24 * 60 * 60 * 1000) {
    // If the time difference is greater than or equal to 24 hours, format as DD - MM - YYYY
    const formattedDate = new Date(timestamp).toLocaleDateString("en-GB");
    return formattedDate;
  } else {
    // If the time difference is less than 24 hours, format as "X hours ago"
    const hoursAgo = Math.floor(timeDifference / (60 * 60 * 1000));
    return `${hoursAgo} hour${hoursAgo > 1 ? "s" : ""} ago`;
  }
}

// format time with input is decimal
export function formatDateTimeDecimal(timestamp: number): string {
  const now = Date.now();
  const timeDifference = now - timestamp;

  if (timeDifference >= 24 * 60 * 60 * 1000) {
    // If the time difference is greater than or equal to 24 hours, format as DD - MM - YYYY
    const formattedDate = new Date(timestamp).toLocaleDateString("en-GB");
    return formattedDate;
  } else {
    // If the time difference is less than 24 hours, format as "X hours ago"
    const hoursAgo = Math.floor(timeDifference / (60 * 60 * 1000));
    return `${hoursAgo} hour${hoursAgo > 1 ? "s" : ""} ago`;
  }
}

export const formatCurrency = (input: number) => {
  return numeral(input).format("0,0.000000") === "NaN"
    ? formatLongNumber(input)
    : numeral(input).format("0,0.0[00000]");
};

export const formatPercent = (input: number) => {
  return numeral(input).format("0,0.00");
};

export const formatCurrencyV2 = (input: number) => {
  return numeral(input).format("0,0.00") === "NaN"
    ? formatLongNumber(input)
    : numeral(input).format("0,0.00");
};

export const checkFormatBalance = (input: number) => {
  return numeral(input).format("0,0.00");
};

export const formatSmallBalance = (input: number) => {
  return numeral(input).format("0.000e+0");
};

export const formatBigBalance = (input: number) => {
  if (checkFormatBalance(input) === "NaN") {
    return {
      number_format: formatSmallBalance(input),
      number_size: "",
    };
  } else {
    const regExp = /[a-zA-Z]/g;
    const numberFormat = numeral(input).format("0.00a");
    if (regExp.test(numberFormat)) {
      return {
        number_format: Number(numberFormat.slice(0, -1)),
        number_size: numberFormat.slice(-1).toUpperCase(),
      };
    } else {
      return {
        number_format: Number(numberFormat),
        number_size: "",
      };
    }
  }
};

export const formatLongNumber = (number: number) => {
  if (!number.toString().includes("e-")) {
    return number;
  }
  const firstValueChar = exponentialToDecimal(number).indexOf(
    number.toString().slice(0, 1)
  );
  const zeroReplace = exponentialToDecimal(number).slice(2, firstValueChar);
  const formatNumber = exponentialToDecimal(number).replace(
    zeroReplace,
    "0..."
  );
  return formatNumber;
};

export const exponentialToDecimal = (exponential: number) => {
  let decimal = exponential.toString().toLowerCase();
  if (decimal.includes("e+")) {
    const exponentialSplitted = decimal.split("e+");
    let postfix = "";
    for (
      let i = 0;
      i <
      +exponentialSplitted[1] -
        (exponentialSplitted[0].includes(".")
          ? exponentialSplitted[0].split(".")[1].length
          : 0);
      i++
    ) {
      postfix += "0";
    }
    const addCommas = (text: any) => {
      let j = 3;
      let textLength = text.length;
      while (j < textLength) {
        text = `${text.slice(0, textLength - j)},${text.slice(
          textLength - j,
          textLength
        )}`;
        textLength++;
        j += 3 + 1;
      }
      return text;
    };
    decimal = addCommas(exponentialSplitted[0].replace(".", "") + postfix);
  }
  if (decimal.toLowerCase().includes("e-")) {
    const exponentialSplitted = decimal.split("e-");
    let prefix = "0.";
    for (let i = 0; i < +exponentialSplitted[1] - 1; i++) {
      prefix += "0";
    }
    decimal = prefix + exponentialSplitted[0].replace(".", "");
  }
  return decimal;
};

export const add3Dots = (string: string, limit: number) => {
  const dots = "...";
  if (string.length > limit) {
    string = string.substring(0, limit) + dots;
  }
  return string;
};

export function truncateAddress(address: string) {
  if (!address) {
    return "";
  }

  return address.slice(0, 4) + "..." + address.slice(-4);
}

export function shortenPrivateKey(privateKey: string): string {
  return privateKey.slice(0, 40) + "..." + privateKey.slice(-6);
}
