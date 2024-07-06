import { wagmiConnectors } from "./wagmiConnectors";
import { Chain, createClient, http } from "viem";
import { hardhat, mainnet } from "viem/chains";
import { createConfig } from "wagmi";
import scaffoldConfig from "~~/scaffold.config";
import { getAlchemyHttpUrl } from "~~/utils/scaffold-eth";
import * as chains from "viem/chains";

const { targetNetworks } = scaffoldConfig;

const allChainsFormatted = Object.values(chains).map(chain => ({
  id: chain.id,
  name: chain.name,
  nativeCurrency: {
      name: chain.nativeCurrency.name,
      symbol: chain.nativeCurrency.symbol,
      decimals: chain.nativeCurrency.decimals,
  },
  rpcUrls: {
      default: {
          http: chain.rpcUrls.default,
      },
  },
  blockExplorers: chain.blockExplorers ? {
      default: {
          name: chain.blockExplorers.default.name,
          url: chain.blockExplorers.default.url,
          apiUrl: chain.blockExplorers.default.apiUrl,
      },
  } : undefined,
  contracts: chain.contracts ? Object.keys(chain.contracts).reduce((acc, key) => {
      acc[key] = {
          address: chain.contracts[key].address,
          blockCreated: chain.contracts[key].blockCreated,
      };
      return acc;
  }, {}) : undefined,
  testnet: chain.testnet,
}));

// We always want to have mainnet enabled (ENS resolution, ETH price, etc). But only once.
export const enabledChains = targetNetworks.find((network: Chain) => network.id === 1)
  ? targetNetworks
  : ([...targetNetworks, mainnet] as const);


export const wagmiConfig = createConfig({
  chains: allChainsFormatted,
  connectors: wagmiConnectors,
  ssr: true,
  client({ chain }) {
    return createClient({
      chain,
      transport: http(getAlchemyHttpUrl(chain.id)),
      ...(chain.id !== (hardhat as Chain).id
        ? {
            pollingInterval: scaffoldConfig.pollingInterval,
          }
        : {}),
    });
  },
});
