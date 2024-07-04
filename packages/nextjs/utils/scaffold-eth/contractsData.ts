import scaffoldConfig from "~~/scaffold.config";
import { contracts } from "~~/utils/scaffold-eth/contract";

export function getAllContracts() {
  let allContractsData = {};
  for (const network of scaffoldConfig.targetNetworks) {
    const contractsData = contracts?.[network.id];
    if (contractsData) {
      allContractsData = { ...allContractsData, ...contractsData };
    }
  }
  return allContractsData;
}
