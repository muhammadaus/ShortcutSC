import React, { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';

const Navigation = ({ account }) => {
  const [activeTab, setActiveTab] = useState('Contract');

  const openTab = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <Navbar className='my-3'>
      <Navbar.Brand href="#" style={{ color: 'black' }}></Navbar.Brand>
      <div className="tab">
        <button className="tablinks" onClick={() => openTab('Notes')}>Notes</button>
        <button className="tablinks" onClick={() => openTab('Roadmap')}>Roadmap</button>
        <button className="tablinks" onClick={() => openTab('About')}>About</button>
      </div>
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text style={{ color: 'black' }}>
          {account && account.slice(0, 5) + '...' + account.slice(38, 42)}
        </Navbar.Text>
      </Navbar.Collapse>

      {activeTab === 'Notes' && (
  <div id="Notes" className="tabcontent">
    <p>This is still under development. Use it at your own risk.</p>
    <p>The code is open source and any suggestions for improvements are very welcome!</p>
  </div>
)}

{activeTab === 'Roadmap' && (
  <div id="Roadmap" className="tabcontent">
    <h2>Roadmap:</h2>
    <ul>
      <li>Adding more network tabs</li>
      <li>Compatibility with more wallets and smart wallets</li>
      <li>Compatibility with applications on top of Ethereum(read: Nillion)</li>
      <li>More features and security audits</li>
    </ul>
  </div>
)}

{activeTab === 'About' && (
  <div id="About" className="tabcontent">
    <p>This webpage is a quick to go tool for users who want to use smart contracts directly in case there is a front end failure for dapps. While there are a few applications exist to interact with smart contracts, the author thinks that there should be a more simple and hopefully faster way to transact to the blockchain. Blockchains such as Ethereum at the very 1st layer have been working continously since inception and so does the importance for a shortcut to transact when it is needed the most.</p>
  </div>
)}
    </Navbar>
  );
}

export default Navigation;