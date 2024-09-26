"use client";

import React, { useState } from 'react';
import { PencilIcon } from "@heroicons/react/24/outline";
import Select, { SingleValue } from 'react-select';
import Link from "next/link";
import type { NextPage } from "next";
// import { useAccount } from "wagmi"; // From base code
import * as viemChains from 'viem/chains';

import { setContracts, deepMergeContracts as importedContracts } from '~~/utils/scaffold-eth/contract';

import { updateTargetNetworks } from '~~/scaffold.config';

interface ChainOption {
  value: string;
  label: string;
}

interface ContractInfo {
  address: string;
  abi: any[]; // Ideally, define a more specific type for ABI
  inheritedFunctions: Record<string, unknown>;
}

interface DeployedContracts {
  [networkId: number]: {
    [contractName: string]: ContractInfo;
  };
}

interface Contracts {
  [key: string]: {
    [contractName: string]: ContractInfo;
  };
}

const UniversalRouter = () => {
  // const { address: connectedAddress } = useAccount(); // From base code
  const [address, setAddress] = useState('');
  const [isAddressEmpty, setIsAddressEmpty] = useState(true);
  const [isAddressTooShort, setIsAddressTooShort] = useState(false);
  const [isAbiInvalid, setIsAbiInvalid] = useState(false);
  const [network, setNetwork] = useState('mainnet');
  const [isContractLoaded, setIsContractLoaded] = useState(false);

  const options: ChainOption[] = Object.keys(viemChains).map(chain => ({ value: chain, label: chain }));

  const handleAbiChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const abi: any[] = JSON.parse(e.target.value); // Correctly parses the JSON string from the textarea
      setIsAbiInvalid(false); // If parsing succeeds, the ABI is valid
    } catch (error) {
      setIsAbiInvalid(true); // If parsing fails, the ABI is invalid
    }
  };

  const handleNetworkChange = (selectedNetwork: SingleValue<ChainOption>) => {
    const networkValue = selectedNetwork ? selectedNetwork.value : '';
    setNetwork(networkValue);
    if (selectedNetwork) {
      // Updated to remove type assertion and use a string type directly
      updateTargetNetworks(selectedNetwork.value);
    } else {
      // Handle the case where selectedNetwork is null
    }
  };

  const handleReadWrite = async () => {
    if (!address) {
      setIsAddressEmpty(true);
      return;
    }
  
    if (!(viemChains as any)[network]) {
      console.error('Network not found in viemChains:', network);
      return;
    }
  
    const element = document.getElementById('contractABI');
    if (!element) {
      alert('Element with ID contractABI not found');
      return; // Exit the function if the element is not found
    }

    let abi;
    try {
      const abiJson = document.getElementById('contractABI').value;
      abi = JSON.parse(abiJson);
    } catch (error) {
      console.error('Invalid ABI:', error);
      return;
    }
  
    // Prepare the contract update
    const contractUpdate = {
      [viemChains[network].id]: {
        YourContract: {
          address: address,
          abi: abi,
        }
      }
    };

    interface ContractInfo {
      address: string;
      abi: any[];
      inheritedFunctions: Record<string, unknown>;
    }
    
    interface Contracts {
      [key: string]: {
        [contractName: string]: ContractInfo;
      };
    }
    
    const contracts: Contracts = {
      "1": {
        "YourContract": {
          "address": "0x0000000000000000000000000000000000000000",
          "abi": [],
          "inheritedFunctions": {}
        }
      }
    };
  
    // Check if contracts is not null and update it
    let updatedContracts;
    if (importedContracts) {
      setContracts(contractUpdate);
    } else {
      console.error('Contracts variable is null');
    }

    console.log('Updated contracts:', contractUpdate);
  
    function updateContracts(updateDeployedContract: ContractUpdate) {
    }

    setIsContractLoaded(true);
  };

  // New state for ABIs
  const [abis, setAbis] = useState<string[]>(['']); // Initialize with one empty ABI input

  const handleAbiChange = (index: number, value: string) => {
    const newAbis = [...abis];
    newAbis[index] = value;
    setAbis(newAbis);
  };

  const addAbiInput = () => {
    setAbis([...abis, '']); // Add a new empty ABI input
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would encode the functions and prepare the execute call
    // Example: encodeFunctions(abis);
  };

  return (
    <>
      <div className="flex flex-col items-center flex-grow pt-10 w-full px-4">
        <h1>Universal Router</h1>
        <form onSubmit={handleSubmit}>
          <h2>Input Smart Contract ABIs</h2>
          {abis.map((abi, index) => (
            <div key={index}>
              <textarea
                value={abi}
                onChange={(e) => handleAbiChange(index, e.target.value)}
                placeholder={`Enter ABI ${index + 1}`}
                required
              />
            </div>
          ))}
          <button type="button" onClick={addAbiInput}>Add Another ABI</button>
          <button type="submit">Execute</button>
        </form>
        <div className="text-center">
          <h1>
            <span className="block text-2xl mb-2">Interact with</span>
            <span className="block text-4xl font-bold">EVM Smart Contract</span>
          </h1>
          <p className="text-lg">
            Input your{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words inline-block">
              smart contract address
            </code>{" "}
            and the designated{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words inline-block">
              abi(application binary interface)
            </code>
          </p>
        </div>
  
        {/* Network Selector - Adjusted with Tailwind CSS for centering and responsive width */}
        <div className="w-full max-w-xs my-4">
          <label htmlFor="networkSelector" className="block text-sm font-medium">Select Network:</label>
          <Select
            id="networkSelector"
            defaultValue={options.find(option => option.value === 'mainnet')}
            options={options}
            onChange={(selectedOption) => {
              if (selectedOption) {
                handleNetworkChange(selectedOption);
              }
            }}
            styles={{
              control: (base) => ({
                ...base,
                width: 300,
                backgroundColor: '#f0f0f0', // Light gray, works on both dark and light backgrounds
                color: '#333', // Darker text color for contrast
              }),
              option: (styles) => ({
                ...styles,
                backgroundColor: '#f0f0f0', // Consistent with the control background
                color: '#333', // Ensuring readability
                ':hover': {
                  backgroundColor: '#e2e2e2', // Slightly darker on hover for visual feedback
                }
              }),
              singleValue: (styles) => ({
                ...styles,
                color: '#333', // Ensuring readability
              }),
            }}
            className="mt-1"
          />
        </div>
  
        {/* Smart Contract Address Input - Adjusted for responsive width */}
        <input 
          type="text" 
          placeholder="Enter Smart Contract Address" 
          maxLength={42} 
          minLength={42} 
          className="w-full max-w-md my-4 p-2 rounded-full"
          value={address} 
          onChange={e => {
            const address = e.target.value;
            setAddress(address);
            setIsAddressEmpty(!address);
            setIsAddressTooShort(address.length < 42);
          }} 
        />
  
        {/* Contract ABI Input - Adjusted for responsive width and height */}
        <textarea 
          className="w-full max-w-lg my-4 p-2 rounded-md h-64"
          id="contractABI" 
          placeholder="Enter Contract ABI (JSON format)" 
          onChange={handleAbiChange}
        />
  
        {/* Load Contract Button - Adjusted for centering */}
        <button 
          id="connectButton" 
          onClick={handleReadWrite}
          className="my-4 px-4 py-2 rounded shadow-lg bg-blue-600 text-white disabled:bg-blue-300"
          disabled={isAddressEmpty || isAddressTooShort || isAbiInvalid || isContractLoaded}
        >
          {isContractLoaded ? '✅' : 'Load Contract'}
        </button>
        {!isAddressEmpty && isAddressTooShort && <p className="text-red-500">Address is too short!</p>}
        {isAddressEmpty && <p className="text-red-500">Address is required!</p>}
        {isAbiInvalid && <p className="text-red-500">Valid ABI is required!</p>}
  
        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <PencilIcon className="h-8 w-8 fill-secondary" />
              <p>
                Read or write your smart contract using the{" "}
                <Link href="/readwrite" passHref className="link">
                  Read/Write
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UniversalRouter;

