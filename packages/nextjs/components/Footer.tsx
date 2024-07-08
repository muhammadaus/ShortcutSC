import React, { useState } from "react";
import Link from "next/link";
import { hardhat } from "viem/chains";
import { CurrencyDollarIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { SwitchTheme } from "~~/components/SwitchTheme";
import { Faucet } from "~~/components/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { useGlobalState } from "~~/services/store/store";

/**
 * Site footer
 */

const PlayIcon = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M4.018 14L14.41 9.9a1 1 0 0 0 0-1.8L4.018 4" />
  </svg>
);

export const Footer = () => {

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrency.price);
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  return (
    <div className="min-h-0 py-5 px-1 mb-11 lg:mb-0">
      <div>
        <div className="fixed flex justify-between items-center w-full z-10 p-4 bottom-0 left-0 pointer-events-none">
          <div className="flex flex-col md:flex-row gap-2 pointer-events-auto">
            {nativeCurrencyPrice > 0 && (
              <div>
                <div className="btn btn-primary btn-sm font-normal gap-1 cursor-auto">
                  <CurrencyDollarIcon className="h-4 w-4" />
                  <span>{nativeCurrencyPrice.toFixed(2)}</span>
                </div>
              </div>
            )}

      <div>
            <button
              className="btn btn-primary btn-sm font-normal gap-1"
              onClick={() => setIsVideoModalOpen(true)}
            >
              <PlayIcon className="h-4 w-4" />
              <span>Watch Tutorial Video *Walkthrough starts at 1:25*</span>
            </button>

            {isVideoModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                <div className="bg-white p-4 rounded-lg max-w-xl w-full">
                  <div className="flex justify-end mb-2">
                    <button onClick={() => setIsVideoModalOpen(false)} className="text-black">
                      Close
                    </button>
                  </div>
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/Tf3sNOOTz_o?autoplay=1"
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            )}
          </div>

            {isLocalNetwork && (
              <>
                <Faucet />
                <Link href="/blockexplorer" passHref className="btn btn-primary btn-sm font-normal gap-1">
                  <MagnifyingGlassIcon className="h-4 w-4" />
                  <span>Block Explorer</span>
                </Link>
              </>
            )}
          </div>
          <SwitchTheme className={`pointer-events-auto ${isLocalNetwork ? "self-end md:self-auto" : ""}`} />
        </div>
      </div>
    </div>
  );
};
