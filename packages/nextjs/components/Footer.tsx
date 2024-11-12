import React from "react";
import Link from "next/link";
import { hardhat } from "viem/chains";
import { CurrencyDollarIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Faucet } from "~~/components/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { useGlobalState } from "~~/services/store/store";

/**
 * Site footer
 */

export const Footer = () => {

  const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrency.price);
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  return (
    <div className="min-h-0 py-5 px-1 mb-11 lg:mb-0">
      <div>
        <div className="fixed flex justify-between items-center w-full z-10 p-4 bottom-0 left-0 pointer-events-none">
          <div className="flex flex-col md:flex-row gap-2 pointer-events-auto">
            {isLocalNetwork && (
              <>
                <Faucet />
                <Link 
                  href="/blockexplorer" 
                  passHref 
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 
                    hover:from-blue-600 hover:to-purple-600 text-white font-normal gap-1 
                    transition-all duration-200 pointer-events-auto"
                >
                  <MagnifyingGlassIcon className="h-4 w-4 inline-block mr-1" />
                  <span>Block Explorer</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
