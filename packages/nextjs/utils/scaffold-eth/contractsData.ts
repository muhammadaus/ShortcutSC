import scaffoldConfig from "~~/scaffold.config";
import { contracts } from "~~/utils/scaffold-eth/contract";

interface ContractData {
  external?: boolean;
}

export function getAllContracts(): Record<string, ContractData> {
  let allContractsData: Record<string, ContractData> = {};
  for (const network of scaffoldConfig.targetNetworks) {
    const contractsData = contracts?.[network.id];
    if (contractsData) {
      allContractsData = { ...allContractsData, ...contractsData };
    }
  }
  return allContractsData;
}
