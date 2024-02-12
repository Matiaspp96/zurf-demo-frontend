import { useReadContract } from "wagmi"
import ZurfABI from '@/assets/abi/ZurfERC20Contract.abi.json'

export const useBalance = (tokenAddress: `0x${string}`, account: `0x${string}`) => {
    const { data, error, isLoading }: {
        data: BigInt | undefined,
        error: Error | null,
        isLoading: boolean
    } = useReadContract({
        abi: ZurfABI,
        address: tokenAddress,
        functionName: "balanceOf",
        args: [account]
    })
    return { data, error, isLoading }
}