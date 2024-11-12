"use client";

import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { BarsArrowUpIcon } from "@heroicons/react/20/solid";
import { ContractUI } from "~~/app/readwrite/_components/contract";
import { ContractName } from "~~/utils/scaffold-eth/contract";
import { getAllContracts } from "~~/utils/scaffold-eth/contractsData";

const selectedContractStorageKey = "scaffoldEth2.selectedContract";
const contractsData = getAllContracts();
const contractNames = Object.keys(contractsData) as ContractName[];

export function ReadWrite() {
  const [selectedContract, setSelectedContract] = useLocalStorage<ContractName>(
    selectedContractStorageKey,
    contractNames[0],
    { initializeWithValue: false },
  );

  useEffect(() => {
    if (!contractNames.includes(selectedContract)) {
      setSelectedContract(contractNames[0]);
    }
  }, [selectedContract, setSelectedContract]);

  return (
    <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-center items-center">
      {contractNames.length === 0 ? (
        <p className="text-3xl mt-14 text-gray-300">No contracts found!</p>
      ) : (
        <>
          {contractNames.length > 1 && (
            <div className="flex flex-row gap-2 w-full max-w-7xl pb-1 px-6 lg:px-10 flex-wrap">
              {contractNames.map(contractName => (
                <button
                  className={`px-4 py-2 rounded-xl font-light transition-all duration-200
                    ${
                      contractName === selectedContract
                        ? "bg-gray-800 text-white shadow-lg"
                        : "bg-gray-900/50 text-gray-300 hover:bg-gray-800 hover:text-white"
                    }
                    backdrop-blur-sm border border-gray-800 hover:border-gray-700`}
                  key={contractName}
                  onClick={() => setSelectedContract(contractName)}
                >
                  <span className="flex items-center gap-2">
                    {contractName}
                    {contractsData[contractName].external && (
                      <span 
                        className="group relative" 
                        data-tip="External contract"
                      >
                        <BarsArrowUpIcon className="h-4 w-4 cursor-pointer" />
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs
                          bg-gray-800 text-gray-300 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity
                          whitespace-nowrap">
                          External contract
                        </span>
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          )}
          {contractNames.map(contractName => (
            <ContractUI
              key={contractName}
              contractName={contractName}
              className={`${contractName === selectedContract ? "" : "hidden"}
                bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6
                text-gray-300`}
            />
          ))}
        </>
      )}
    </div>
  );
}
