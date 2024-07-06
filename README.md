Smart Contract Interaction Front End
Main Page

This project is a front end that can interact with any smart contracts. You just need the smart contract address, the ABI, and the network it is deployed to. Load the necessary contract address, ABI, and network selection.
Read/Write Page

The smart contract will be read/written using RPC connected from the browser wallet. The necessary parameters are unlike typical web3 frontends which require the exact input from smart contracts. Ensure that the number of parameters passed is exactly as in the function of the smart contracts.

    Read: Insert the required address or parameters to read a function.
    Write: Insert the necessary parameters to write into the blockchain, such as sending ether, making a swap, or minting an NFT.

Background

This webpage serves as a quick tool for users who wish to interact directly with smart contracts, particularly in instances where there may be a front-end failure for dApps. While several applications exist for interacting with smart contracts, the author believes there should be a simpler and, ideally, faster method to transact with the blockchain. Blockchains, such as Ethereum, have been operating continuously since their inception, and so does the importance of a shortcut for transactions when it's needed most.
