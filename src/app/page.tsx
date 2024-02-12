"use client";
import ZurfLogo from "@/assets/icons/Zurf_logo.webp";
import PolygonVector from "@/assets/icons/polygon-vector.svg";
import WalletVector from "@/assets/icons/wallet-vector.svg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBalance } from "@/hooks/useBalance";
import {
  balanceToUsd,
  cn,
  parseBalance,
  percentageChange,
  priceChange,
  totalBalance,
} from "@/lib/utils";
import { getHistoryPrice } from "@/services/getHistoryPrice.service";
import { getPrice } from "@/services/getPrice.service";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";

const tokens: {
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

export default function Home() {
  const { open } = useWeb3Modal();
  const { isConnected } = useAccount();

  /* Tokens Balance */
  const { address } = useAccount();
  const ZurfToken = useBalance(
    tokens[0].address,
    // "0x6914c5b9ab9b49bCF84f980Ff773Bf2ae6186A6D"
    address!
  );
  const MaticToken = useBalance(tokens[1].address, address!);

  /* Get Price Token */
  const [zurfPrice, setZurfPrice] = useState<number>(0);
  const [maticPrice, setMaticPrice] = useState<number>(0);
  const [zurfYesterdayPrice, setZurfYesterdayPrice] = useState<number>(0);
  const [maticYesterdayPrice, setMaticYesterdayPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const getPriceAndUpdateState = async (token: string) => {
    try {
      const price = await getPrice(token);
      switch (token) {
        case tokens[0].coinGeckoId:
          setZurfPrice(price);
          break;
        case tokens[1].coinGeckoId:
          setMaticPrice(price);
          break;
      }
      return price;
    } catch (error) {
      console.error(error);
      return 0;
    }
  };

  const getHistoryPriceAndUpdateState = async (token: string, date: string) => {
    try {
      const price = await getHistoryPrice(token, date);
      switch (token) {
        case tokens[0].coinGeckoId:
          setZurfYesterdayPrice(price);
          break;
        case tokens[1].coinGeckoId:
          setMaticYesterdayPrice(price);
          break;
      }
      return price;
    } catch (error) {
      console.error(error);
      return 0;
    }
  };

  useEffect(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dd = String(yesterday.getDate()).padStart(2, "0");
    const mm = String(yesterday.getMonth() + 1).padStart(2, "0");
    const yyyy = yesterday.getFullYear();
    const date = `${dd}-${mm}-${yyyy}`;

    const fetchPrices = async () => {
      await Promise.all([
        getPriceAndUpdateState(tokens[0].coinGeckoId),
        getPriceAndUpdateState(tokens[1].coinGeckoId),
        getHistoryPriceAndUpdateState(tokens[0].coinGeckoId, date),
        getHistoryPriceAndUpdateState(tokens[1].coinGeckoId, date),
      ]).catch((error) => {
        console.error(error);
      });
    };

    fetchPrices();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center py-10 px-5 md:p-24">
      <header className="flex max-md:flex-col-reverse items-center space-x-4 w-full justify-between gap-5">
        <Card className="max-md:w-full bg-zinc-100">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Image src={WalletVector} width={40} height={40} alt="wallet" />
              <CardTitle className="text-xl">
                Wallet -{" "}
                {zurfPrice > 0 &&
                  maticPrice > 0 &&
                  isConnected &&
                  totalBalance([
                    { balance: ZurfToken.data?.toString()!, price: zurfPrice },
                    {
                      balance: MaticToken.data?.toString()!,
                      price: maticPrice,
                    },
                  ]).toFixed(2)}{" "}
                US$
              </CardTitle>
            </div>
          </CardHeader>
        </Card>
        <h1 className="bg-clip-text max-md:hidden text-transparent bg-gradient-to-r from-pink-800 to-violet-800 text-4xl font-bold border-b-2">
          Portfolio Balance
        </h1>
        {!isConnected ? (
          <Button onClick={() => open()}>Connect Wallet</Button>
        ) : (
          <Button onClick={() => open()}>Disconnect Wallet</Button>
        )}
        <h1 className="bg-clip-text text-transparent bg-gradient-to-r from-pink-800 to-violet-800 text-3xl font-bold border-b-2">
          Portfolio Balance
        </h1>
      </header>
      {isConnected && (
        <Table className="mt-4 border">
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-400">ACTIVO</TableHead>
              <TableHead className="text-gray-400">PRECIO</TableHead>
              <TableHead className="text-gray-400">BALANCE</TableHead>
              <TableHead className="text-gray-400">VALOR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tokens.map((token) => (
              <TableRow key={token.symbol}>
                <TableCell className="flex items-center space-x-2 w-max">
                  <Image
                    src={token.symbol === "ZRF" ? ZurfLogo : PolygonVector}
                    width={40}
                    height={40}
                    alt="wallet"
                  />
                  <span>
                    {token.name} ({token.symbol})
                  </span>
                </TableCell>
                <TableCell>
                  {zurfPrice >= 0 && token.symbol === "ZRF"
                    ? zurfPrice
                    : maticPrice >= 0 && maticPrice}{" "}
                  US$
                </TableCell>
                <TableCell>
                  {zurfPrice >= 0 &&
                    maticPrice >= 0 &&
                    parseBalance(
                      token.symbol === "ZRF"
                        ? ZurfToken.data?.toString()!
                        : MaticToken.data?.toString()!
                    ).toFixed(2)}{" "}
                  {token.symbol}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold">
                      {zurfPrice >= 0 &&
                        maticPrice >= 0 &&
                        balanceToUsd(
                          token.symbol === "ZRF"
                            ? ZurfToken.data?.toString()!
                            : MaticToken.data?.toString()!,
                          token.symbol === "ZRF" ? zurfPrice : maticPrice
                        )}{" "}
                      US$
                    </span>
                    <Badge
                      className={cn(
                        "bg-green-600/50 w-max text-zinc-900 hover:bg-green-500/70",
                        {
                          "bg-red-600/50 hover:bg-red-500/70":
                            percentageChange(
                              token.symbol === "ZRF" ? zurfPrice : maticPrice,
                              token.symbol === "ZRF"
                                ? zurfYesterdayPrice
                                : maticYesterdayPrice
                            ) < 0,
                        }
                      )}
                      variant="secondary"
                    >
                      {zurfPrice >= 0 &&
                        maticPrice >= 0 &&
                        Number(
                          percentageChange(
                            token.symbol === "ZRF" ? zurfPrice : maticPrice,
                            token.symbol === "ZRF"
                              ? zurfYesterdayPrice
                              : maticYesterdayPrice
                          ).toFixed(2)
                        )}
                      % (
                      {zurfPrice >= 0 &&
                        maticPrice >= 0 &&
                        priceChange(
                          token.symbol === "ZRF" ? zurfPrice : maticPrice,
                          token.symbol === "ZRF"
                            ? zurfYesterdayPrice
                            : maticYesterdayPrice
                        ).toFixed(2)}
                      US$)
                    </Badge>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </main>
  );
}
