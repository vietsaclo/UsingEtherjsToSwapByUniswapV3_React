import { ethers } from "ethers";
import { useSelector } from "react-redux";
import { I_SesstionUser } from "../utils/Interfaces";
import { MyWeb3Modal } from "../utils/MyWeb3Configs";

const useWalletConnected = () => {
  const sessionUserReducer: I_SesstionUser = useSelector((state: any) => state.sessionUser);

  const UseGetProvider = async () => {
    if (!sessionUserReducer.account) return null;

    const connectWallet = await MyWeb3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connectWallet);
    return provider;
  }

  const UseGetSigner = async () => {
    const provider = await UseGetProvider();
    if (!provider) return null;

    const signer = provider.getSigner(sessionUserReducer.account);
    return signer;
  }

  return {
    UseGetProvider,
    UseGetSigner,
  }
}

export default useWalletConnected;
