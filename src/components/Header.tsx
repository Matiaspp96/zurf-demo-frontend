"use client";
import Image from "next/image";
import PolygonVector from "@/assets/icons/polygon-vector.svg";
import BscVector from "@/assets/icons/bsc-vector.svg";
import WalletVector from "@/assets/icons/wallet-vector.svg";
import ConnectVector from "@/assets/icons/connect-vector.svg";
import DisconnectVector from "@/assets/icons/disconnect-vector.svg";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { totalBalance } from "@/lib/utils";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";
import { Badge } from "./ui/badge";

interface HeaderProps {
  zurfPrice: number;
  maticPrice: number;
  ZurfToken: any;
  MaticToken: any;
}

const Header: React.FC<HeaderProps> = ({
  zurfPrice,
  maticPrice,
  ZurfToken,
  MaticToken,
}) => {
  const { open } = useWeb3Modal();
  const { isConnected, chain } = useAccount();
  console.log("isConnected", isConnected, chain);
  return (
    <header className="flex max-md:flex-col-reverse items-center w-full justify-between border-b border-white pb-8 max-md:gap-6">
      <Card className="max-md:w-max bg-neutral-600/40 h-24 flex items-center hover:bg-neutral-300/40">
        <CardHeader className="h-24 py-5">
          <div className="flex items-center justify-center space-x-2">
            <Image
              src={WalletVector}
              width={40}
              height={40}
              alt="wallet icon"
              className="mr-2 w-6 h-6"
            />
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
          {isConnected && (
            <Badge className="w-max ml-auto">
              {" "}
              <Image
                src={chain?.name === "Polygon" ? PolygonVector : BscVector}
                width={40}
                height={40}
                alt="wallet icon"
                lazyBoundary="100px"
                className="mr-2 w-4 h-4"
              />
              {chain?.name} Network
            </Badge>
          )}
        </CardHeader>
      </Card>
      <Card className="max-md:w-full bg-neutral-600/40 max-md:hidden relative min-w-[450px] text-center">
        <CardHeader className="bg-clip-text text-transparent bg-gradient-to-b from-[#00FFFF] to-neutral-600 text-5xl font-bold z-10">
          Portfolio Balance
        </CardHeader>
        <div className="bg-transparent absolute min-w-full top-0 min-h-full z-0 ">
          <div
            className="animation-delay-2000 mix-blend-multiply filter blur-2xl w-24 h-24 bg-yellow-500/20 rounded-full absolute -z-10
            left-1/2 -translate-x-1/2 animate-blob"
          />
        </div>
        {/* <div className="animate-blob animation-delay-2000 mix-blend-multiply filter blur-xl opacity-50 w-64 h-64 bg-pink-300 rounded-full absolute -top-32 -left-16" /> */}
      </Card>
      <div className="max-md:flex justify-end max-md:w-full gap-4 items-end">
        <h2 className="max-md:w-max md:bg-neutral-600/40 md:hidden text-center max-md:border-0 max-md:bg-transparent bg-clip-text text-transparent bg-gradient-to-b from-[#00FFFF] to-neutral-600 text-4xl font-bold max-md:p-0">
          Portfolio Balance
        </h2>
        {!isConnected ? (
          <Button
            className="bg-neutral-600/40 text-xl text-primary  hover:bg-neutral-300/40 h-24 md:px-8 rounded-xl max-md:w-10 max-md:h-10 max-md:p-0"
            onClick={() => open()}
          >
            <Image
              src={ConnectVector}
              width={40}
              height={40}
              alt="connect icon"
              className="mr-2 w-6 h-6"
            />
            <p className="max-md:hidden">Connect Wallet</p>
          </Button>
        ) : (
          <Button
            className="bg-neutral-600/40 text-xl text-primary  hover:bg-neutral-300/40 h-24 md:px-8 rounded-xl max-md:w-10 max-md:h-10 max-md:p-0"
            onClick={() => open()}
          >
            <Image
              src={DisconnectVector}
              width={40}
              height={40}
              alt="connect icon"
              className="mr-2 w-6 h-6 max-md:mx-auto"
            />
            <p className="max-md:hidden">Disconnect Wallet</p>
          </Button>
        )}
      </div>
    </header>
  );
};
export default Header;
