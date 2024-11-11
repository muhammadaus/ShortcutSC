"use client";

import React, { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const Home = () => {
  const [address, setAddress] = useState('');
  const [abi, setAbi] = useState('');
  const [isValidAddress, setIsValidAddress] = useState(true);
  const [isValidAbi, setIsValidAbi] = useState(true);
  
  // Validation functions
  const validateAddress = (addr: string) => {
    const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    return ethereumAddressRegex.test(addr);
  };
  
  const validateAndFormatAbi = (abiString: string) => {
    try {
      JSON.parse(abiString);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  // Handle input changes
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setAddress(input);
    setIsValidAddress(input === '' || validateAddress(input));
  };
  
  const handleAbiChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    setAbi(input);
    setIsValidAbi(input === '' || validateAndFormatAbi(input));
  };
  
  const handleSubmit = () => {
    if (isValidAddress && isValidAbi && address && abi) {
      console.log('Valid submission:', { address, abi });
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

      {/* Address Input */}
      <div className="w-full max-w-md my-4">
        <div className="relative">
          <input
            type="text"
            value={address}
            onChange={handleAddressChange}
            placeholder="Enter Smart Contract Address"
            className={`w-full p-3 rounded-xl bg-gray-800/50 backdrop-blur-sm border 
              ${!isValidAddress ? 'border-red-500' : 'border-gray-700'}
              text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 
              ${!isValidAddress ? 'focus:ring-red-500' : 'focus:ring-blue-500'}
              transition-all duration-200`}
          />
          {address && (
            <div className="absolute right-3 top-3">
              {isValidAddress ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* ABI Input */}
      <div className="w-full max-w-lg my-4">
        <div className="relative">
          <textarea
            value={abi}
            onChange={handleAbiChange}
            placeholder="Enter Contract ABI (JSON format)"
            rows={8}
            className={`w-full p-3 rounded-xl bg-gray-800/50 backdrop-blur-sm border 
              ${!isValidAbi ? 'border-red-500' : 'border-gray-700'}
              text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 
              ${!isValidAbi ? 'focus:ring-red-500' : 'focus:ring-blue-500'}
              transition-all duration-200 font-mono text-sm`}
          />
          {abi && (
            <div className="absolute right-3 top-3">
              {isValidAbi ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
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

