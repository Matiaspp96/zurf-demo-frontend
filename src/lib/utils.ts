import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const tokens: {
  name: string;
  symbol: string;
  coinGeckoId: string;
  address: `0x${string}`;
}[] = [
    {
      name: "Zurf",
      symbol: "ZRF",
      coinGeckoId: "zurf",
      address: "0x232804231dE32551F13A57Aa3984900428aDf990",
    },
    {
      name: "Matic",
      symbol: "MATIC",
      coinGeckoId: "matic-network",
      address: "0x0000000000000000000000000000000000001010",
    },
  ];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const parseBalance = (balance: string): number => {
  return isNaN(Number(balance) / 1000000000000000000) ? 0 : Number(balance) / 1000000000000000000;
};

export const balanceToUsd = (balance: string, price: number): number => {
  return isNaN(parseBalance(balance) * price) ? 0 : Number((parseBalance(balance) * price).toFixed(2));
};

export const percentageChange = (currentPrice: number, yesterdayPrice: number) => {
  const change = ((currentPrice - yesterdayPrice) / yesterdayPrice) * 100;
  if (isNaN(change)) {
    return 0;
  }
  if (change === Infinity) {
    return 0;
  }
  return change;
};

export const priceChange = (currentPrice: number, yesterdayPrice: number) => {
  return currentPrice - yesterdayPrice;
};

export const totalBalance = (tokens: { balance: string; price: number }[]
) =>
  tokens.reduce((acc, token) => {
    return acc + balanceToUsd(token.balance, token.price);
  }, 0);

