import { QRCodeSVG } from "qrcode.react";
import { Address as AddressType } from "viem";
import { Address } from "~~/components/scaffold-eth";

type AddressQRCodeModalProps = {
  address: AddressType;
  modalId: string;
  className?: string;
};

export const AddressQRCodeModal = ({ address, modalId, className = "" }: AddressQRCodeModalProps) => {
  return (
    <dialog id={modalId} className="modal">
      <div className={`modal-box bg-gray-900/50 backdrop-blur-sm border border-gray-800 
        rounded-xl shadow-xl p-6 ${className}`}>
        <div className="flex flex-col items-center gap-4">
          <QRCodeSVG value={address} size={256} />
          <Address address={address} format="long" />
        </div>
        <form method="dialog">
          <button className="btn btn-circle btn-ghost absolute right-2 top-2 
            text-gray-400 hover:text-gray-300 hover:bg-gray-800">✕</button>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};
