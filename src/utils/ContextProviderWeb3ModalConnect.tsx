
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { WagmiProvider } from 'wagmi'
import { arbitrum, mainnet, goerli } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId at https://cloud.walletconnect.com
// const projectId = String(process.env.REACT_APP_WEB3_MODAL_WALLET_CONNECT);
const projectId = 'f78180a8e45ede6927e3eeda2335c600';

// 2. Create wagmiConfig
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example 22',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, arbitrum, goerli] as const
const config = defaultWagmiConfig({
  chains, // required
  projectId, // required
  metadata, // required
  enableWalletConnect: true, // Optional - true by default
  enableInjected: true, // Optional - true by default
  enableEIP6963: true, // Optional - true by default
  enableCoinbase: true, // Optional - true by default
})

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  // enableAnalytics: true // Optional - defaults to your Cloud configuration
})

type web3ModalProps = PropsWithChildren<{

}>

const ContextProviderWeb3ModalConnect = (props: web3ModalProps) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProviderWeb3ModalConnect;
