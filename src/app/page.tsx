"use client";
import ZurfLogo from "@/assets/icons/Zurf_logo.webp";
import PolygonVector from "@/assets/icons/polygon-vector.svg";
import Header from "@/components/Header";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
  tokens,
  totalBalance,
} from "@/lib/utils";
import { getHistoryPrice } from "@/services/getHistoryPrice.service";
import { getPrice } from "@/services/getPrice.service";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function Home() {
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
  const [fetchingByAPI, setFetchingByAPI] = useState<boolean>(false);
  const [loadingAPI, setLoadingAPI] = useState<boolean>(false);
  const [loadingBalance, setLoadingBalance] = useState<boolean>(false);

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
      console.log(error);
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
      console.log(error);
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
      setLoadingAPI(true);
      setFetchingByAPI(true);
      await Promise.all([
        getPriceAndUpdateState(tokens[0].coinGeckoId),
        getPriceAndUpdateState(tokens[1].coinGeckoId),
        getHistoryPriceAndUpdateState(tokens[0].coinGeckoId, date),
        getHistoryPriceAndUpdateState(tokens[1].coinGeckoId, date),
      ]).catch((error) => {
        console.error(error);
        setZurfPrice(0);
        setMaticPrice(0);
        setZurfYesterdayPrice(0);
        setMaticYesterdayPrice(0);
        setLoadingAPI(true);
        return 0;
      });
      setLoadingAPI(false);
    };

    if (isConnected && !fetchingByAPI) fetchPrices();
  }, [isConnected, fetchingByAPI, setFetchingByAPI, setLoadingAPI]);

  return (
    <main className="flex min-h-screen flex-col items-center py-10 px-5 md:p-24 bg-neutral-900 ">
      <Header
        zurfPrice={zurfPrice}
        maticPrice={maticPrice}
        ZurfToken={ZurfToken}
        MaticToken={MaticToken}
      />
      {isConnected && (
        <div className="rounded-md border w-full mt-8">
          <Table className="">
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
                      className={ZurfLogo && "rounded-full"}
                    />
                    <span>
                      {token.name} ({token.symbol})
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      {loadingAPI ? (
                        <Skeleton className="w-20 h-6 my-0.5" />
                      ) : zurfPrice >= 0 &&
                        !loadingAPI &&
                        maticPrice >= 0 &&
                        token.symbol === "ZRF" ? (
                        zurfPrice.toFixed(4)
                      ) : (
                        maticPrice >= 0 && maticPrice.toFixed(4)
                      )}{" "}
                      US$
                      {loadingAPI ? (
                        <Skeleton className="w-20 h-6 my-0.5" />
                      ) : (
                        <Badge
                          className={cn(
                            "bg-green-400/50 w-max text-zinc-900 hover:bg-green-500/70",
                            {
                              "bg-red-400/50 hover:bg-red-500/70":
                                percentageChange(
                                  token.symbol === "ZRF"
                                    ? zurfPrice
                                    : maticPrice,
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
                            ).toFixed(2)}{" "}
                          US$)
                        </Badge>
                      )}
                    </div>
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
                        {loadingAPI && <Skeleton className="w-20 h-6" />}
                        {zurfPrice >= 0 &&
                          !loadingAPI &&
                          maticPrice >= 0 &&
                          balanceToUsd(
                            token.symbol === "ZRF"
                              ? ZurfToken.data?.toString()!
                              : MaticToken.data?.toString()!,
                            token.symbol === "ZRF" ? zurfPrice : maticPrice
                          )}{" "}
                        US$
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </main>
  );
}
