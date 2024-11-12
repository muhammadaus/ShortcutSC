import { useRef, useState } from "react";
import { NetworkOptions } from "./NetworkOptions";
import CopyToClipboard from "react-copy-to-clipboard";
import { getAddress } from "viem";
import { Address } from "viem";
import { useDisconnect } from "wagmi";
import {
  ArrowLeftOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  ArrowsRightLeftIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  DocumentDuplicateIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import { BlockieAvatar, isENS } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { getTargetNetworks } from "~~/utils/scaffold-eth";

const allowedNetworks = getTargetNetworks();

type AddressInfoDropdownProps = {
  address: Address;
  blockExplorerAddressLink: string | undefined;
  displayName: string;
  ensAvatar?: string;
  className?: string;
};

export const AddressInfoDropdown = ({
  address,
  ensAvatar,
  displayName,
  blockExplorerAddressLink,
  className = "",
}: AddressInfoDropdownProps) => {
  const { disconnect } = useDisconnect();
  const checkSumAddress = getAddress(address);

  const [addressCopied, setAddressCopied] = useState(false);

  const [selectingNetwork, setSelectingNetwork] = useState(false);
  const dropdownRef = useRef<HTMLDetailsElement>(null);
  const closeDropdown = () => {
    setSelectingNetwork(false);
    dropdownRef.current?.removeAttribute("open");
  };
  useOutsideClick(dropdownRef, closeDropdown);

  return (
    <div className="dropdown dropdown-end">
      <label 
        tabIndex={0} 
        className={`btn btn-sm px-2 shadow-md rounded-xl 
          bg-gray-900/50 backdrop-blur-sm border border-gray-800 
          hover:bg-gray-800 transition-colors duration-200 ${className}`}
      >
        <BlockieAvatar address={address} size={24} ensImage={ensAvatar} />
        <span className="ml-2 mr-1 text-gray-300">{displayName}</span>
        <ChevronDownIcon className="h-6 w-4 ml-2 sm:ml-0 text-gray-400" />
      </label>
      <ul 
        tabIndex={0} 
        className="dropdown-content menu z-[2] p-2 mt-2 shadow-lg 
          bg-gray-900/50 backdrop-blur-sm border border-gray-800 
          rounded-xl text-gray-300"
      >
        <li>
          <CopyToClipboard text={address}>
            <div className="flex items-center gap-2 py-2 hover:bg-gray-800 rounded-lg transition-colors duration-200">
              <DocumentDuplicateIcon className="h-4 w-4 text-gray-400" />
              <span className="whitespace-nowrap">Copy Address</span>
            </div>
          </CopyToClipboard>
        </li>
        <li>
          <label htmlFor="qrcode-modal" className="hover:bg-gray-800">
            <QrCodeIcon className="h-4 w-4 text-gray-400" />
            <span>View QR Code</span>
          </label>
        </li>
        {blockExplorerAddressLink && (
          <li>
            <a href={blockExplorerAddressLink} target="_blank" rel="noopener noreferrer" className="hover:bg-gray-800">
              <ArrowTopRightOnSquareIcon className="h-4 w-4 text-gray-400" />
              <span>View on Block Explorer</span>
            </a>
          </li>
        )}
      </ul>
    </div>
  );
};
