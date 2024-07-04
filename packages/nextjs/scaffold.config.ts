import { Chain, defineChain } from "viem";
import * as chains from "viem/chains";
import { contracts } from "~~/utils/scaffold-eth/contract";

export type ScaffoldConfig = {
  targetNetworks: readonly chains.Chain[];
  pollingInterval: number;
  alchemyApiKey: string;
  walletConnectProjectId: string;
  onlyLocalBurnerWallet: boolean;
};

// function findChainNameByChainId(chains: { [key: string]: any }, chainId: number): string | undefined {
//   for (const chainName in chains) {
//     if (chains.hasOwnProperty(chainName) && chains[chainName].chainId === chainId) {
//       return chainName;
//     }
//   }
//   return undefined;
// }

// // Example usage
// const chainIdToFind = Object.keys(contracts)[0]; // Example chain ID to find
// const chainName = findChainNameByChainId(chains, chainIdToFind);
// if (chainName) {
//   console.log(`Chain ID ${chainIdToFind} corresponds to: ${chainName}`);
// } else {
//   console.log(`Chain with ID ${chainIdToFind} not found.`);
// }

const scaffoldConfig = {
  // The networks on which your DApp is live
  targetNetworks: [chains.mainnet],

  // The interval at which your front-end polls the RPC servers for new data
  // it has no effect if you only target the local network (default is 4000)
  pollingInterval: 30000,

  // This is ours Alchemy's default API key.
  // You can get your own at https://dashboard.alchemyapi.io
  // It's recommended to store it in an env variable:
  // .env.local for local testing, and in the Vercel/system env config for live apps.
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF",

  // This is ours WalletConnect's default project ID.
  // You can get your own at https://cloud.walletconnect.com
  // It's recommended to store it in an env variable:
  // .env.local for local testing, and in the Vercel/system env config for live apps.
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64",

  // Only show the Burner Wallet when running on hardhat network
  onlyLocalBurnerWallet: true,
} as const satisfies ScaffoldConfig;

export function updateTargetNetworks(selectedNetwork: keyof typeof chains) {
  // Check if the selected network exists in the chains object
  if (chains[selectedNetwork]) {
    scaffoldConfig.targetNetworks = [chains[selectedNetwork]];
    console.log(`Updated targetNetworks to: ${selectedNetwork}`);
  } else {
    console.error(`The selected network (${selectedNetwork}) does not exist.`);
  }
}

export default scaffoldConfig;
