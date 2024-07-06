import React, { useEffect, useState } from 'react';
import Navigation from './Navigation';



const viemChains = require('viem/chains');
const options = Object.keys(viemChains).map(chain => ({ value: chain, label: chain }));

const ModalComponent = ({ show, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
  <div className="modal-content">
    <h2>Thank you for trying this website!</h2>
    <p>Unfortunately the website is outdated and you should go to <a href="https://shortcut-sc-nextjs-git-merge-scaffold-muhammad-aus-projects.vercel.app?_vercel_share=V6Ku1sASA6BHIVYWcSp8CiPgdWxeZVkW" target="_blank" rel="noopener noreferrer">Scaffold Site</a>. instead. *If you are unsure please check the github</p>
    <p>Reason: Fleek or IPFS supported web domains still does not support developers to publish the latest NextJS tech, so for the time being we will use vercel for testing and some real use-case.</p>
    <button onClick={onClose}>Close</button>
  </div>
</div>
  );
};

function App() {
  const [showModal, setShowModal] = useState(false);


  return (
    <div className="App">
      <ModalComponent show={showModal} onClose={() => setShowModal(false)} />
  <Navigation />
    </div>
  );
}

export default App;