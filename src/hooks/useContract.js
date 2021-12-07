import { useMemo } from "react";
import { ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";

export default function useContract(
  address,
  ABI
) {

  return useMemo(() => {
    if (!address || !ABI) {
      return null;
    }

    try {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      return new Contract(address, ABI, signer);
    } catch (error) {
      console.error("Failed To Get Contract", error);
      return null;
    }
  }, [address, ABI]);
}