import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { ethers } from 'ethers';
import Navigation from './Navigation';
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk'
import Select from 'react-select';

import { getAbiItem } from 'viem'
import { getContract } from 'viem'
import { createPublicClient, createWalletClient, http, custom } from 'viem'


const viemChains = require('viem/chains');
const options = Object.keys(viemChains).map(chain => ({ value: chain, label: chain }));

 

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [abi, setAbi] = useState(null);
  const [values, setValues] = useState(['', '', '', '', '', '', '', '', '']);
  const [network, setNetwork] = useState('mainnet');
  const [isAddressTooShort, setIsAddressTooShort] = useState(false);
  const [isAddressEmpty, setIsAddressEmpty] = useState(false);
  const [address, setAddress] = useState('');
  const [output, setOutput] = useState(null);

  console.log(`Network: ${network}`);


  const publicClient = createPublicClient({
    chain: viemChains[network],
    transport: custom(window.ethereum)
  })

  const walletClient = createWalletClient({
    chain: viemChains[network],
    transport: custom(window.ethereum)
  })
   

  const sdk = new CoinbaseWalletSDK({
    appName: 'ShortcutSC',
    appChainIds: [1,	42161, 421614]
  });

  const inputValuesRef = useRef({});

  const handleNetworkChange = async (network) => {
    setNetwork(network);
  
    try {
      await walletClient.switchChain({ id: viemChains[network].id });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await walletClient.addChain({ chain: viemChains[network] });
        } catch (addError) {
          // Handle "add" error.
        }
      }
      // Handle other "switch" errors.
    }
  };


  const handleInputChange = (index) => (event) => {
    const newValues = [...values];
    newValues[index] = event.target.value;
    setValues(newValues);
  };

  useEffect(() => {
    console.log(values);
  }, [values]);

  const handleConnect = async () => {
    if (!address) {
      setIsAddressEmpty(true);
      return;
    }
    const abiJson = document.getElementById('contractABI').value;
    const abi = JSON.parse(abiJson);
    setAbi(abi);
  
    console.log(`Contract ABI:`, abi);
  
    if (window.ethereum) {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = ethers.utils.getAddress(accounts[0]);
        setAccount(account);
        console.log(`Connected with address: ${account}`);
  
        // Initialize the contract
        const contract = getContract({
          address: address,
          abi: abi,
          client: { public: publicClient, wallet: walletClient }
        });
  
        // Call each function that doesn't require inputs and is a view function
        for (const item of abi) {
          if (item.type === 'function' && item.stateMutability === 'view' && (item.inputs === undefined || item.inputs.length === 0)) {
            const data = await publicClient.readContract({
              address: address,
              abi: abi,
              functionName: item.name,
            });
            setOutput(prevOutput => ({
              ...prevOutput,
              [item.name]: data
            }));
          }
        }
      } catch (error) {
        console.error(`Failed to connect: ${error}`);
      }
    }
  };


  const handleSign = async (methodName, params) => {
    
    console.log(`methodName: ${methodName}, params:`, params);
    if (!window.ethereum) {
      return;
    }
  
    try {

      try {
        await walletClient.switchChain({ id: viemChains[network].id });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await walletClient.addChain({ chain: viemChains[network] });
          } catch (addError) {
            // Handle "add" error.
            console.error(`Failed to add network:`, addError);
          }
        }
      }
      
      // Find the function object from the contract using the function name
      const functionObject = getAbiItem({ abi, name: methodName });
    
      console.log('Contract ABI:', abi);
      console.log('Function object:', functionObject);
    
      if (!functionObject) {
        throw new Error(`Function ${methodName} not found on contract`);
      }
  
      // Filter out empty strings from params
      const filteredParams = params.filter(param => param !== '');

      console.log(address)
  
      // Prepare the transaction
      const { request } = await publicClient.simulateContract({
        address: address,
        abi: abi,
        functionName: methodName,
        args: filteredParams,
        account
      });

      console.log('Request:', request);
  
      // Estimate the gas for the transaction
      const gasEstimate = await publicClient.estimateContractGas(request);

      console.log('Gas estimate:', gasEstimate);
  
      // Prepare the transaction for eth_sendTransaction
      const sendTransaction = {
        ...request,
        gas: gasEstimate
      };

      console.log('Send transaction:', sendTransaction);
  
      // Send the transaction with the estimated gas
      const result = await walletClient.writeContract(sendTransaction);
  
      console.log(result);
    } catch (error) {
      console.error(`Failed to sign ${methodName}:`, error);
    }
  };

  useEffect(() => {
    async function loadWeb3() {
      if (window.ethereum) {
        const provider = sdk.makeWeb3Provider({ options: 'all' });
        setProvider(provider);
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) 
          const account = ethers.utils.getAddress(accounts[0]);
          setAccount(account);
          console.log(`Connected with address: ${account}`);
        } catch (error) {
          console.error("User denied account access");
        }
      } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }

      const client = createWalletClient({
        account, 
        chain: viemChains[network],
        transport: custom(window.ethereum)
      })
      setSigner(client);
    }

    loadWeb3();
  }, []);

  // rest of your code

  return (
    <div className="App">
  <Navigation />
  <h1>Interact with EVM Smart Contract</h1>
<label htmlFor="networkSelector">Select Network:</label>
<Select
  id="networkSelector"
  defaultValue={options.find(option => option.value === 'mainnet')}
  options={options}
  onChange={selectedOption => handleNetworkChange(selectedOption.value)}
/>
<input 
  type="text" 
  placeholder="Enter Smart Contract Address" 
  maxLength="42" 
  minLength="42" 
  style={{ width: '400px' }}
  value={address} // Add this line
  onChange={e => {
    const address = e.target.value;
    setAddress(address);
    setIsAddressEmpty(false);
    setIsAddressTooShort(address.length < 42);
  }} 
/>
        {isAddressTooShort && <p style={{ color: 'red' }}>Address is too short!</p>}
      <div>
        {/* ... */}
        <textarea 
            style={{ width: '500px' }}
            id="contractABI" placeholder="Enter Contract ABI (JSON format)" />
        <button id="connectButton" onClick={handleConnect}>Connect</button>
        {isAddressEmpty && <p style={{ color: 'red' }}>Address is required!</p>}
        <div>
  {output && Object.entries(output).map(([key, value]) => (
    <div key={key}>
      <strong>{key}:</strong> {value}
    </div>
  ))}
</div>
        {abi && abi.map((item, index) => {
  if (item.inputs && item.inputs.length > 0) {
    return (
      <div key={index}>
        <label>{item.name}</label>
        {item.inputs.map((input, inputIndex) => (
          <div key={inputIndex}>
            <input 
              type="text" 
              placeholder={`Enter value ${inputIndex + 1} for ${input.name}`} 
              onChange={e => {
                console.log(`Input value for ${input.name}:`, e.target.value);
                inputValuesRef.current[input.name] = e.target.value; // Store the input value in the ref
                handleInputChange(input.name, inputIndex, e.target.value);
              }} 
            />
          </div>
        ))}
        <button onClick={() => {
  console.log(`values:`, values);
  handleSign(item.name, Object.values(inputValuesRef.current)); // Pass the values of the ref to handleSign
}}>Sign {item.name}</button>
      </div>
    );
  } else {
    return (
      <div key={index}>
        <button onClick={() => handleSign(item.name)}>Sign {item.name}</button>
      </div>
    );
  }
})}
        {/* ... */}
      </div>
      <div id="contractInteraction" style={{display: 'none'}}>
        <button id="callFunction">Call Function</button>
        <div id="result"></div>
      </div>
    </div>
  );
}

export default App;