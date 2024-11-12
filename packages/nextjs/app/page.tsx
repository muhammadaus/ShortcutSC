"use client";

import React, { useState } from 'react';
import Link from "next/link";
import type { NextPage } from "next";
import { PencilIcon } from "@heroicons/react/24/outline";
import Select, { SingleValue } from 'react-select';
import * as viemChains from 'viem/chains';
import { isAddress } from 'viem';
import { setContracts } from '~~/utils/scaffold-eth/contract';
import { updateTargetNetworks } from '~~/scaffold.config';
import { Chain } from 'viem/chains';
import { Address } from "viem";
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

// Define the chain names type from viem/chains
type ChainName = keyof typeof import('viem/chains');

// Define the ChainOption interface
interface ChainOption {
  value: ChainName;
  label: string;
}

const Home: NextPage = () => {
  const [address, setAddress] = useState('');
  const [abi, setAbi] = useState('');
  const [isAddressEmpty, setIsAddressEmpty] = useState(true);
  const [isAddressTooShort, setIsAddressTooShort] = useState(false);
  const [isAbiInvalid, setIsAbiInvalid] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<ChainOption>({ 
    value: 'mainnet' as ChainName, 
    label: 'mainnet' 
  });
  const [isContractLoaded, setIsContractLoaded] = useState(false);
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [isValidAbi, setIsValidAbi] = useState(false);

  const options: ChainOption[] = Object.keys(viemChains).map(chain => ({ 
    value: chain as ChainName, 
    label: chain 
  }));

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    setIsAddressEmpty(!newAddress);
    setIsAddressTooShort(newAddress.length < 42);
    setIsValidAddress(isAddress(newAddress));
  };

  const handleAbiChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newAbi = e.target.value;
    setAbi(newAbi);
    try {
      JSON.parse(newAbi);
      setIsAbiInvalid(false);
      setIsValidAbi(true);
    } catch (error) {
      setIsAbiInvalid(true);
      setIsValidAbi(false);
    }
  };

  const handleNetworkChange = (selected: SingleValue<ChainOption>) => {
    if (selected) {
      setSelectedNetwork(selected);
      updateTargetNetworks(selected.value);
    }
  };

  const handleReadWrite = async () => {
    if (!address) {
      setIsAddressEmpty(true);
      return;
    }

    let parsedAbi;
    try {
      parsedAbi = JSON.parse(abi);
    } catch (error) {
      console.error('Invalid ABI:', error);
      setIsAbiInvalid(true);
      return;
    }

    const formattedAddress = address as `0x${string}`;
    
    const contractUpdate: GenericContractsDeclaration = {
      [(viemChains as any)[selectedNetwork.value].id]: {
        YourContract: {
          address: formattedAddress,
          abi: parsedAbi,
          inheritedFunctions: {}
        }
      }
    };

    try {
      setContracts(contractUpdate);
      setIsContractLoaded(true);
    } catch (error) {
      console.error('Error updating contracts:', error);
    }
  };

  return (
    <div className="flex flex-col items-center flex-grow pt-10 w-full px-4 min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="text-center">
        <h1>
          <span className="block text-2xl mb-2 text-gray-300">Interact with</span>
          <span className="block text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            EVM Smart Contract
          </span>
        </h1>
        <p className="text-lg text-gray-300">
          Input your{" "}
          <code className="italic bg-gray-800 text-blue-400 font-bold max-w-full break-words inline-block px-2 py-1 rounded">
            smart contract address
          </code>{" "}
          and the designated{" "}
          <code className="italic bg-gray-800 text-blue-400 font-bold max-w-full break-words inline-block px-2 py-1 rounded">
            abi(application binary interface)
          </code>
        </p>
      </div>

      <div className="w-full max-w-md my-4">
        <label htmlFor="networkSelector" className="block text-sm font-medium text-gray-300 mb-2">
          Select Network:
        </label>
        <Select
          id="networkSelector"
          value={selectedNetwork}
          options={options}
          onChange={handleNetworkChange}
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: '#1f2937',
              borderColor: '#374151',
              color: '#fff',
              boxShadow: 'none',
              '&:hover': {
                borderColor: '#4b5563'
              }
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: '#1f2937',
              border: '1px solid #374151'
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isFocused ? '#374151' : '#1f2937',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#374151'
              }
            }),
            singleValue: (base) => ({
              ...base,
              color: '#fff'
            }),
            input: (base) => ({
              ...base,
              color: '#fff'
            })
          }}
          className="mt-1"
        />
      </div>

      <input
        type="text"
        value={address}
        onChange={handleAddressChange}
        placeholder="Enter Smart Contract Address"
        className={`w-full max-w-md my-4 p-3 rounded-xl bg-gray-800/50 backdrop-blur-sm border 
          ${!isValidAddress ? 'border-red-500' : 'border-gray-700'}
          text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 
          ${!isValidAddress ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
      />

      <textarea
        value={abi}
        onChange={handleAbiChange}
        placeholder="Enter Contract ABI (JSON format)"
        className={`w-full max-w-lg my-4 p-3 rounded-xl bg-gray-800/50 backdrop-blur-sm border 
          ${!isValidAbi ? 'border-red-500' : 'border-gray-700'}
          text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 
          ${!isValidAbi ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
        rows={8}
      />

      <button
        onClick={handleReadWrite}
        disabled={!isValidAddress || !isValidAbi || !address || !abi}
        className={`my-4 px-6 py-3 rounded-xl shadow-lg transition-all duration-200
          ${(!isValidAddress || !isValidAbi || !address || !abi)
            ? 'bg-gray-700 cursor-not-allowed text-gray-400'
            : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
          } font-medium`}
      >
        Load Contract
      </button>
    </div>
  );
};

export default Home;

