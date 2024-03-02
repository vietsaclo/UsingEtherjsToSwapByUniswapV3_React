import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Funcs } from "../../utils";
import { useDispatch } from "react-redux";
import { connectWalletReducer, disconnectWalletReducer } from "../../app-reducers/SessionUserReducer";
import { MyWeb3Modal } from "../../utils/MyWeb3Configs";

const ButtonConnectWallet = () => {
  const dispatch = useDispatch();

  const [provider, setProvider] = useState<any>();
  const [account, setAccount] = useState<string>();

  const handleConnectWallet = async () => {
    if (account) {
      disconnect();
    } else {
      await connectWallet();
    }
  }

  const connectWallet = async () => {
    try {
      const provider = await MyWeb3Modal.connect();
      const library = new ethers.providers.Web3Provider(provider);
      const accounts = await library.listAccounts();
      const network = await library.getNetwork();

      dispatch(connectWalletReducer({
        account: accounts[0],
        chainId: network.chainId,
      }))

      setProvider(provider);
      if (accounts) setAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  }

  const refreshState = () => {
    setAccount('');
  };

  const disconnect = () => {
    MyWeb3Modal.clearCachedProvider();
    dispatch(disconnectWalletReducer());
    refreshState();
  };

  useEffect(() => {
    if (MyWeb3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts: any[]) => {
        console.log("accountsChanged", accounts);
        if (accounts) setAccount(accounts[0]);
      };

      const handleChainChanged = (_hexChainId: any) => {
        // setChainId(_hexChainId);
      };

      const handleDisconnect = () => {
        disconnect();
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider]);

  return (
    <div className="d-flex align-items-center justify-content-end h-100 w-100">
      <button onClick={() => handleConnectWallet()} className="wallet-connect-btn fw-bold">
        {account ? Funcs.fun_trimAddress(account || '') : 'Connect Wallet'}
      </button>
    </div>
  );
}

export default ButtonConnectWallet;
