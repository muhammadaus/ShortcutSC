import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Web3 from 'web3';

function App() {
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [abi, setAbi] = useState(null);
  const [values, setValues] = useState({});
  const [network, setNetwork] = useState('');

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


  const handleInputChange = (name, value) => {
    setValues(prevValues => ({ ...prevValues, [name]: value }));
  };

  const handleConnect = async () => {
    const abiJson = document.getElementById('contractABI').value;
  const abi = JSON.parse(abiJson);
  setAbi(abi);

    if (window.ethereum) {
      try {
        // Request account access
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
  };

  const handleSign = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
  
      // Replace 'contract-address' with the address of your contract
      const contract = new ethers.Contract('contract-address', abi, signer);
  
      // Replace 'methodName' with the name of the method you want to call
      const method = contract.methods.methodName(...Object.values(values));
  
      // Estimate the gas required to execute the method
      const gas = await method.estimateGas({ from: signer.getAddress() });
  
      // Sign and send the transaction
      const tx = await method.send({ gasLimit: gas });
      const receipt = await tx.wait();
  
      console.log('Transaction receipt:', receipt);
    }
  };

  useEffect(() => {
    async function loadWeb3() {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        setWeb3(web3);
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const account = ethers.utils.getAddress(accounts[0]);
          setAccount(account);
          console.log(`Connected with address: ${account}`);
        } catch (error) {
          console.error("User denied account access");
        }
      } else if (window.web3) {
        const web3 = new Web3(window.web3.currentProvider);
        setWeb3(web3);
      } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    }

    loadWeb3();
  }, []);

  // rest of your code

  return (
    <div>
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
          <input key={inputIndex} type="text" placeholder={`Enter value for ${input.name}`} onChange={e => handleInputChange(input.name, e.target.value)} />
        ))}
        <button onClick={() => handleSign(item.name)}>Sign {item.name}</button>
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