import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { cookieStorage, createStorage } from 'wagmi'
import { bscTestnet, polygon } from 'wagmi/chains'

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID_WC

if (!projectId) throw new Error('Project ID is not defined')

const metadata = {
    name: 'Zurf Balance',
    description: 'Zurf Balance Demo',
    url: 'https://web3modal.com', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// Create wagmiConfig
export const config = defaultWagmiConfig({
    chains: [polygon, bscTestnet],
    projectId,
    metadata,
    ssr: true,
    storage: createStorage({
        storage: cookieStorage
    }),
})