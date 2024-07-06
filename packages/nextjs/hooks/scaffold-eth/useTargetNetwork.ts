import { useEffect, useMemo } from "react";
import { useAccount } from "wagmi";
import scaffoldConfig from "~~/scaffold.config";
import { useGlobalState } from "~~/services/store/store";
import { ChainWithAttributes } from "~~/utils/scaffold-eth";
import { NETWORKS_EXTRA_DATA } from "~~/utils/scaffold-eth";

/**
 * Retrieves the connected wallet's network from scaffold.config or defaults to the 0th network in the list if the wallet is not connected.
 */

export function useTargetNetwork(): { targetNetwork: ChainWithAttributes } {
  const { chain } = useAccount();
  const targetNetwork = useGlobalState(({ targetNetwork }) => targetNetwork);
  const setTargetNetwork = useGlobalState(({ setTargetNetwork }) => setTargetNetwork);

  useEffect(() => {
    // Directly set the new network without matching with the wallet chain ID
    if (scaffoldConfig.targetNetworks[0] && scaffoldConfig.targetNetworks[0].id !== targetNetwork.id) {
      setTargetNetwork(scaffoldConfig.targetNetworks[0]); // Assuming you want to set the first network from scaffoldConfig.targetNetworks
    }
  }, [setTargetNetwork, targetNetwork.id, scaffoldConfig.targetNetworks]);
  
  return useMemo(
    () => ({
      targetNetwork: {
        ...targetNetwork,
        ...NETWORKS_EXTRA_DATA[targetNetwork.id],
      },
    }),
    [targetNetwork.id]
  );
}


