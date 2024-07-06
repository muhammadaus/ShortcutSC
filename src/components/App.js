import React, { useEffect, useState } from 'react';
import Navigation from './Navigation';

function App() {
  useEffect(() => {
    window.location.href = "https://shortcut-sc-nextjs-git-merge-scaffold-muhammad-aus-projects.vercel.app?_vercel_share=V6Ku1sASA6BHIVYWcSp8CiPgdWxeZVkW";
  }, []);

  return (
    <div className="App">
      <Navigation />
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>You will be redirected soon! If not read the description below</h2>
          <p>Unfortunately the website is outdated and you should go to <a href="https://shortcut-sc-nextjs-git-merge-scaffold-muhammad-aus-projects.vercel.app?_vercel_share=V6Ku1sASA6BHIVYWcSp8CiPgdWxeZVkW" target="_blank" rel="noopener noreferrer">Scaffold Site</a>. instead. *If you are unsure please check the github</p>
          <p>Reason: Fleek or IPFS supported web domains still does not support developers to publish the latest NextJS tech, so for the time being we will use vercel for testing and some real use-case.</p>
        </div>
      </div>
    </div>
  );
}

export default App;