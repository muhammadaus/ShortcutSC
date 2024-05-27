window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
        const web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            document.getElementById('connectButton').innerText = 'Connected';

            document.getElementById('connectButton').addEventListener('click', () => {
                const contractAddress = document.getElementById('contractAddress').value;
                const abiJson = document.getElementById('contractABI').value;

                if (web3.utils.isAddress(contractAddress)) {
                    try {
                        const abi = JSON.parse(abiJson);
                        document.getElementById('contractInteraction').style.display = 'block';
                        setupContractInteraction(web3, contractAddress, abi);
                    } catch (e) {
                        alert('Invalid ABI');
                        console.error(e);
                    }
                } else {
                    alert('Invalid address');
                }
            });
        } catch (error) {
            console.error(error);
        }
    } else {
        alert('Please install MetaMask!');
    }
});

async function setupContractInteraction(web3, contractAddress, abi) {
    const contract = new web3.eth.Contract(abi, contractAddress);

    document.getElementById('callFunction').addEventListener('click', async () => {
        try {
            const accounts = await web3.eth.getAccounts();
            // Example read operation
            const result = await contract.methods.yourReadFunction().call({ from: accounts[0] });
            document.getElementById('result').innerText = `Result: ${result}`;

            // Example write operation
            // const receipt = await contract.methods.yourWriteFunction().send({ from: accounts[0] });
            // document.getElementById('result').innerText = `Transaction Hash: ${receipt.transactionHash}`;
        } catch (error) {
            console.error(error);
        }
    });
}
