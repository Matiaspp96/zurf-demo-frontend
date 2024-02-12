import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const parseBalance = (balance: string): number => {
  return Number(balance) / 1000000000000000000;
};

export const balanceToUsd = (balance: string, price: number): number => {
  return Number((parseBalance(balance) * price).toFixed(2))
};

export const percentageChange = (currentPrice: number, yesterdayPrice: number) => {
  return ((currentPrice - yesterdayPrice) / yesterdayPrice) * 100;
};

export const priceChange = (currentPrice: number, yesterdayPrice: number) => {
  return currentPrice - yesterdayPrice;
};

export const totalBalance = (tokens: { balance: string; price: number }[]
) =>
  tokens.reduce((acc, token) => {
    return acc + balanceToUsd(token.balance, token.price);
  }, 0);

