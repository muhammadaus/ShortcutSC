import React, { useEffect, useState, useRef } from 'react';
import Select from 'react-select';
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';
import Navigation from './Navigation';
import { getAbiItem, getContract, createPublicClient, createWalletClient, custom, getAddress, parseEther } from 'viem';


const viemChains = require('viem/chains');
const options = Object.keys(viemChains).map(chain => ({ value: chain, label: chain }));

 

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [abi, setAbi] = useState(null);
  const [values, setValues] = useState(['', '', '', '', '', '', '', '', '']);
  const [network, setNetwork] = useState('mainnet');
  const [isAddressEmpty, setIsAddressEmpty] = useState(true);
  const [isAddressTooShort, setIsAddressTooShort] = useState(true);
  const [isAbiInvalid, setIsAbiInvalid] = useState(true);
  const [address, setAddress] = useState('');
  const [output, setOutput] = useState(null);
  const [message, setMessage] = useState('');

  if (!window.ethereum) {
    setMessage("No EVM wallet is connected");
  } else {
    const publicClient = createPublicClient({
      chain: viemChains[network],
      transport: custom(window.ethereum)
    });
  
    const walletClient = createWalletClient({
      chain: viemChains[network],
      transport: custom(window.ethereum)
    });
  }

  useEffect(() => {
    document.title = "Interact Smart Contract";
    const checkAccounts = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length === 0) {
          // MetaMask is locked or the user has not connected any accounts
          setMessage("No Ethereum wallet is connected");
        } else {
          // An account is connected
          setMessage("");
        }
      } else {
        setMessage("No Ethereum wallet is connected");
      }
    };
  
    checkAccounts();
  
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          setMessage("No Ethereum wallet is connected");
        } else {
          setMessage("");
        }
      };
  
      window.ethereum.on('accountsChanged', handleAccountsChanged);
  
      // Clean up the event listener
      return () => window.ethereum.off('accountsChanged', handleAccountsChanged);
    }
  }, []);

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

  const handleAbiChange = (e) => {
    const abi = e.target.value;
    try {
      JSON.parse(abi);
      setIsAbiInvalid(false);
    } catch (error) {
      setIsAbiInvalid(true);
    }
  };

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

  const handleConnect = async () => {
    if (window.ethereum) {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = getAddress(accounts[0]);
        setAccount(account);
  
        // Listen for accountsChanged event to handle wallet disconnection
        window.ethereum.on('accountsChanged', (accounts) => {
          console.log(`Accounts changed: ${accounts}`);
          if (accounts.length === 0) {
            // Wallet is disconnected
            setAccount(null); // or setAccount('');
          } else {
            // Wallet is connected
            const account = getAddress(accounts[0]);
            setAccount(account);
          }
        });
      } catch (error) {
        console.error(`Failed to connect: ${error}`);
      }
    } else {
      console.error('Ethereum object is not available on window.');
    }
  };

  const handleReadWrite = async () => {
    if (!address) {
      setIsAddressEmpty(true);
      return;
    }
  
    let abi;
    try {
      const abiJson = document.getElementById('contractABI').value;
      abi = JSON.parse(abiJson);
    } catch (error) {
      console.error('Invalid ABI:', error);
      // Handle the error appropriately here, such as by displaying an error message to the user
      return;
    }
    setAbi(abi);
  
    if (window.ethereum) {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = getAddress(accounts[0]);
        setAccount(account);
  
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
    } else {
      console.error('Ethereum object is not available on window.');
    }
  };


  const handleSign = async (methodName, params) => {
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
    
      if (!functionObject) {
        throw new Error(`Function ${methodName} not found on contract`);
      }

      let value;
      if (inputValuesRef.current['value']) {
        value = parseEther(inputValuesRef.current['value']);
      }
      
      // Filter out empty strings from params
      const filteredParams = params.filter(param => param !== inputValuesRef.current['value']);
  
      // Prepare the transaction
      const { request } = await publicClient.simulateContract({
        address: address,
        abi: abi,
        functionName: methodName,
        args: filteredParams,
        account
      });

  
      // Estimate the gas for the transaction
      const gasEstimate = await publicClient.estimateContractGas(request);
      // Prepare the transaction for eth_sendTransaction
      const sendTransaction = {
        ...request,
        gas: gasEstimate,
        value: value
      };
  
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
          const account = getAddress(accounts[0]);
          setAccount(account);
        } catch (error) {
          console.error("User denied account access");
        }
      } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    }

    loadWeb3();
  }, [account]);


  return (
    <div className="App">
  <Navigation account={account} />
  <button onClick={handleConnect} style={{
    backgroundColor: '#000000',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '4px'
}}
disabled={!!account}>{account ? `${account.slice(0, 5)}...${account.slice(-5)}` : 'Connect Wallet'}</button>
  <h1>Interact with EVM Smart Contract
  <p style={{ color: 'red' }}>{message}</p></h1>
<label htmlFor="networkSelector">Select Network:</label>
<Select
  id="networkSelector"
  defaultValue={options.find(option => option.value === 'mainnet')}
  options={options}
  onChange={selectedOption => handleNetworkChange(selectedOption.value)}
  styles={{ control: (base) => ({ ...base, width: 300 }) }}
/>
<input 
  type="text" 
  placeholder="Enter Smart Contract Address" 
  maxLength="42" 
  minLength="42" 
  style={{ width: '400px' }}
  value={address} 
  onChange={e => {
    const address = e.target.value;
    setAddress(address);
    setIsAddressEmpty(false);
    setIsAddressTooShort(address.length < 42);
  }} 
/>
      <div>
        {/* ... */}
        <textarea 
    style={{ 
        width: '500px', 
        height: '300px', 
        overflow: 'auto'
    }}
    id="contractABI" 
    placeholder="Enter Contract ABI (JSON format)" 
    onChange={handleAbiChange}
/>
        <button id="connectButton" onClick={handleReadWrite} style={{
    borderRadius: '4px'
}} disabled={isAddressEmpty || isAddressTooShort || isAbiInvalid}>Read Contract</button>
        {!isAddressEmpty && isAddressTooShort && <p style={{ color: 'red' }}>Address is too short!</p>}
        {isAddressEmpty && <p style={{ color: 'red' }}>Address is required!</p>}
        {isAbiInvalid && <p style={{ color: 'red' }}>Valid ABI is required!</p>}
        <div>
  {output && Object.entries(output).map(([key, value]) => (
    <div key={key}>
      <strong>{key}:</strong> {value}
    </div>
  ))}
</div>
{abi && abi.map((item, index) => {
  if (!item.name) {
    return null; 
  }
  if (item.stateMutability == 'view') {
    return null; 
  }
  return (
    <div key={index}>
      <label>{item.name}</label>
      {item.inputs && item.inputs.length > 0 && item.inputs.map((input, inputIndex) => (
        <div key={inputIndex}>
          <input 
            style={{ width: '400px' }}
            type="text" 
            placeholder={`Enter value ${inputIndex + 1} for ${input.name}`} 
            onChange={e => {
              inputValuesRef.current[input.name] = e.target.value; // Store the input value in the ref
              handleInputChange(input.name, inputIndex, e.target.value);
            }} 
          />
        </div>
      ))}
      {item.stateMutability === 'payable' && (
        <div>
          <input 
            style={{ width: '400px' }}
            type="text" 
            placeholder="Enter Ether amount" 
            onChange={e => {
              inputValuesRef.current['value'] = e.target.value; // Store the Ether amount in the ref
            }} 
          />
        </div>
      )}
      <button onClick={() => {
        handleSign(item.name, Object.values(inputValuesRef.current)); // Pass the values of the ref to handleSign
      }}>Sign {item.name}</button>
    </div>
  );
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