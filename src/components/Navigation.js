import React, { useEffect, useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Web3 from 'web3';

import { commandInputs, generateBytecode } from './Universal-router-encoder.js';


import { MerkleTree } from 'merkletreejs';
import { keccak256 } from 'js-sha3';


const Navigation = ({ account }) => {

  const [bytecode1, setBytecode1] = useState('');
  const [bytecode2, setBytecode2] = useState('');
  const [activeTab, setActiveTab] = useState('Contract');
  const [command, setCommand] = useState("0x00");
  const [encoderType, setEncoderType] = useState(null);
  const [inputFields, setinputFields] = useState(commandInputs[command].map(() => ''));


  const [merkleProof, setMerkleProof] = useState('');
  const [signature, setSignature] = useState('');

  const handleEncode = () => {
    const { bytecode1, bytecode2 } = generateBytecode(command, inputFields);
    setBytecode1(bytecode1);
    setBytecode2(bytecode2);
};

  const handleInputChange = (index, event) => {
      const values = [...inputFields];
      values[index] = event.target.value;
      setinputFields(values);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!account) {
      alert('Please connect your account first.');
      return;
    }
  
    // Sign a message
    const message = "Your message"; // Replace with your message
    const web3 = new Web3(window.ethereum); // Create a new Web3 instance
    const signature = await web3.eth.personal.sign(message, account, 'test password'); // Replace 'test password' with the account password

    // Generate the Merkle proof
    const leaves = [keccak256(message), keccak256('another message')];
    const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const leaf = keccak256(message);
    const merkleProof = merkleTree.getProof(leaf).map(x => '0x' + x.data.toString('hex'));
  
    setMerkleProof(merkleProof);
    setSignature(signature);
  };

  const address = '0x4841324A5B3AB1a2BBD2ecD1fBd5346867A1f2F1';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      alert('Address copied to clipboard!');
    } catch (err) {
      alert('Failed to copy address: ', err);
    }
  };

  const openTab = (tabName) => {
    if (activeTab === tabName) {
      setActiveTab(null); // if the tab is already open, close it
    } else {
      setActiveTab(tabName); // otherwise, open the tab
    }
  };

  useEffect(() => {
    setinputFields(commandInputs[command].map(() => ''));
  }, [command]);

  return (
    <Navbar expanded={true} className='my-3' expand="lg" bg="light" variant="light" fixed="right">
    <Navbar.Brand href="#" style={{ color: 'black' }}></Navbar.Brand>
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
          <Nav.Link onClick={() => openTab('Notes')}>Notes</Nav.Link>
          <Nav.Link onClick={() => openTab('Roadmap')}>Roadmap</Nav.Link>
          <Nav.Link onClick={() => openTab('About')}>About</Nav.Link>
          <Nav.Link onClick={() => openTab('Encoder')}>Encoder(Input in bytes format)</Nav.Link>
          <Nav.Link onClick={() => openTab('Merkle-Proof')}>MerkleProof(For claiming airdrops)</Nav.Link>
          <Nav.Link onClick={() => openTab('Gift')}>Send Me a Gift</Nav.Link>
          
        </Nav>
        <Navbar.Text style={{ color: 'black' }}>
          {account && account.slice(0, 5) + '...' + account.slice(38, 42)}
        </Navbar.Text>
        
      </Navbar.Collapse>

      {activeTab === 'Notes' && (
  <div id="Notes" className="tabcontent">
    <p>This tool is permissionless. However, users are advised to do their own research and use it at their own risk.</p>
    <p>The code is open source and any suggestions for improvements are very welcome!</p>
    <a href="https://github.com/muhammadaus/ShortcutSC" target="_blank" rel="noopener noreferrer">
  https://github.com/muhammadaus/ShortcutSC
</a>
  </div>
)}

{activeTab === 'Roadmap' && (
  <div id="Roadmap" className="tabcontent">
    <h2>Roadmap:</h2>
    <ul>
      <li>Compatibility with more wallets and smart wallets</li>
      <li>Compatibility with applications on top of Ethereum(read: Nillion)</li>
      <li>More features and security audits</li>
    </ul>
  </div>
)}

{activeTab === 'About' && (
  <div id="About" className="tabcontent">
    <p>"This webpage serves as a quick tool for users who wish to interact directly with smart contracts, particularly in instances where there may be a front-end failure for dApps. 
      While several applications exist for interacting with smart contracts, 
      the author believes there should be a simpler and, ideally, faster method to transact with the blockchain. Blockchains, such as Ethereum, have been operating continuously since their inception, 
      and so does the importance of a shortcut for transactions when it's needed most."</p>
  </div>
)}

{activeTab === 'Encoder' && (
  <div id="Encoder" className="tabcontent" style={{ margin: '1em' }} key={`${bytecode1}-${bytecode2}`}>
  <button onClick={() => setEncoderType('universal-router')}>Use Universal Router Encoder</button>
  {encoderType === 'universal-router' && (
    <>
      <select onChange={(e) => setCommand(e.target.value)} style={{ display: 'block', margin: '1em 0' }}>
        {Object.keys(commandInputs).map((cmd) => (
          <option key={cmd} value={cmd}>{cmd}</option>
        ))}
      </select>
      {(commandInputs[command] || []).map((input, index) => (
        <div key={index} style={{ margin: '1em 0' }}>
          <label>{input.name}:</label>
          <input type="text" value={inputFields[index] || ''} onChange={(e) => handleInputChange(index, e)} />
        </div>
      ))}
      <button onClick={handleEncode} style={{ display: 'block', margin: '1em 0' }}>Encode</button>
      <textarea readOnly value={bytecode1 || ''} style={{ display: 'block', margin: '1em 0' }} />
      <button onClick={() => navigator.clipboard.writeText(bytecode1)} style={{ display: 'block', margin: '1em 0' }}>Copy Bytecode1</button>
      <textarea readOnly value={bytecode2 || ''} style={{ display: 'block', margin: '1em 0' }} />
      <button onClick={() => navigator.clipboard.writeText(bytecode2)} style={{ display: 'block', margin: '1em 0' }}>Copy Bytecode2</button>
    </>
  )}
</div>
)}

{activeTab === 'Merkle-Proof' && (
  <div id="Merkle-Proof" className="tabcontent">
    <form onSubmit={handleSubmit}>
        <button type="submit">Generate Merkle Proof and Signature</button>
        <label>
          Merkle Proof:
          <textarea readOnly value={merkleProof} />
        </label>
        <label>
          Signature:
          <textarea readOnly value={signature} />
        </label>
      </form>
    </div>
)}

{activeTab === 'Gift' && (
  <div id="Gift" className="tabcontent">
    <p>Here is my address. Appreciate that very much!</p>
    <p>{address}</p>
      <button onClick={handleCopy}>Copy Address</button>
  </div>
)}
    </Navbar>
    
  );
}

export default Navigation;