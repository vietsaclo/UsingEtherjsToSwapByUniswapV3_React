import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount } from 'wagmi'
import { Funcs } from '../../utils'

const ButtonConnectWallet = () => {
  const { open } = useWeb3Modal()
  const { address, isConnected } = useAccount()

  return (
    <div className="d-flex align-items-center justify-content-end h-100 w-100">
      <button onClick={() => open({ view: 'Account' })} className="wallet-connect-btn fw-bold">
        {isConnected ? Funcs.fun_trimAddress(address ?? '') : 'Connect'}
      </button>
    </div>
  );
}

export default ButtonConnectWallet;
