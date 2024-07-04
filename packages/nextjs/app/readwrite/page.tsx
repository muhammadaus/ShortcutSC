import { DebugContracts } from "./_components/DebugContracts";
import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "ReadWrite Contracts",
  description: "Interact with your deployed contracts in an easy way",
});

const Debug: NextPage = () => {
  return (
    <>
      <DebugContracts />
    </>
  );
};

export default Debug;
