import React, { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import { createPublicClient, createWalletClient, http, custom } from 'viem'
import { getAddress } from 'viem'
import { Button } from 'react-bootstrap';

const Navigation = ({ account }) => {
  const [activeTab, setActiveTab] = useState('Contract');

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

  return (
    <Navbar expanded={true} className='my-3' expand="lg" bg="light" variant="light" fixed="right">
    <Navbar.Brand href="#" style={{ color: 'black' }}></Navbar.Brand>
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
          <Nav.Link onClick={() => openTab('Notes')}>Notes</Nav.Link>
          <Nav.Link onClick={() => openTab('Roadmap')}>Roadmap</Nav.Link>
          <Nav.Link onClick={() => openTab('About')}>About</Nav.Link>
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