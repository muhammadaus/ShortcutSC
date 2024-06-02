import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { ethers } from 'ethers';
import Navigation from './Navigation';

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [abi, setAbi] = useState(null);
  const [values, setValues] = useState(['', '', '', '', '', '', '', '', '']);
  const [network, setNetwork] = useState('');

  const inputValuesRef = useRef({});

  const handleNetworkChange = async (event) => {
    const network = event.target.value;
    setNetwork(network);
  
    const networks = {
      mainnet: { chainId: '0x1', rpcUrls: ['https://eth.llamarpc.com'] },
      arbitrum: { 
        chainId: '0xa4b1', 
        rpcUrls: ['https://arbitrum.llamarpc.com'],
        chainName: 'Arbitrum',
        nativeCurrency: {
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18
        },
        blockExplorerUrls: ['https://arbiscan.io/'] 
      },
      arbitrum_sepolia: { 
        chainId: '0x66eee', 
        rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
        chainName: 'Arbitrum Sepolia Testnet',
        nativeCurrency: {
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18
        },
        blockExplorerUrls: ['https://sepolia.arbiscan.io/'] 
      },
      // Add more networks here
    };
  
    const networkData = networks[network];
  
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: networkData.chainId }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: networkData.chainId,
                chainName: networkData.chainName,
                rpcUrls: networkData.rpcUrls,
                iconUrls: networkData.iconUrls,
                nativeCurrency: networkData.nativeCurrency,
                blockExplorerUrls: networkData.blockExplorerUrls,
              },
            ],
          });
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
    const abiJson = document.getElementById('contractABI').value;
    const abi = JSON.parse(abiJson);
    setAbi(abi);

    const contractAddress = document.getElementById('contractAddress').value;

    if (window.ethereum) {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = ethers.utils.getAddress(accounts[0]);
        setAccount(account);
        console.log(`Connected with address: ${account}`);

        // Initialize the contract
        const contract = new ethers.Contract(contractAddress, abi, signer);
        setContract(contract);
      } catch (error) {
        console.error("User denied account access");
      }
    } else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  };


  const handleSign = async (methodName, params) => {
    console.log(`methodName: ${methodName}, params:`, params);
    if (!window.ethereum) {
      return;
    }
  
    try {
      // Find the function object from the contract using the function name
      const functionObject = contract.interface.getFunction(methodName);
      console.log('Contract ABI:', contract.interface.fragments);
console.log('Function object:', functionObject);
      if (!functionObject) {
        throw new Error(`Function ${methodName} not found on contract`);
      }
  
      // Filter out empty strings from params
      const filteredParams = params.filter(param => param !== '');
  
      // Prepare the transaction
const transaction = {
  to: contract.address,
  from: account,
  data: contract.interface.encodeFunctionData(methodName, filteredParams)
};
  
      // Estimate the gas for the transaction
      const gasEstimate = await window.ethereum.request({
        method: 'eth_estimateGas',
        params: [transaction]
      });
  
      // Prepare the transaction for eth_sendTransaction
      const sendTransaction = {
        ...transaction,
        gas: gasEstimate
      };
  
      // Send the transaction with the estimated gas
      const result = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [sendTransaction]
      });
  
      console.log(result);
    } catch (error) {
      console.error(`Failed to sign ${methodName}:`, error);
    }
  };

  useEffect(() => {
    async function loadWeb3() {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        const signer = provider.getSigner();
        setSigner(signer);
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const account = ethers.utils.getAddress(accounts[0]);
          setAccount(account);
          console.log(`Connected with address: ${account}`);
        } catch (error) {
          console.error("User denied account access");
        }
      } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    }

    loadWeb3();
  }, []);

  // rest of your code

  return (
    <div className="App">
      <Navigation />
      <h1>Interact with Ethereum Smart Contract</h1>
    <label htmlFor="networkSelector">Select Network:</label>
    <select id="networkSelector" value={network} onChange={handleNetworkChange}>
        <option value="mainnet">Mainnet</option>
        <option value="arbitrum">Arbitrum Mainnet</option>
        <option value="arbitrum_sepolia">Arbitrum Sepolia Testnet</option>
    </select>
      <input type="text" id="contractAddress" placeholder="Enter Smart Contract Address" />
      <div>
        {/* ... */}
        <textarea id="contractABI" placeholder="Enter Contract ABI (JSON format)" />
        <button id="connectButton" onClick={handleConnect}>Connect</button>
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