import { erc20Abi } from "viem";
import { ethers } from "ethers";
import { useAccount, useWalletClient } from "wagmi";
import useWalletConnected from "./useWalletConnected";
import { UNI_SWAP_CONFIG } from "../utils/Consts";
import { I_SwapReponse } from "../utils/Interfaces";
const { abi: SwapRouterABI } = require('@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json')

const useUniswapHooks = () => {
  const { data: walletClient } = useWalletClient();
  const { address: userAddress } = useAccount();
  const { UseGetProvider, UseGetSigner } = useWalletConnected();

  const UseSwap = async (fromAdd: string, toAdd: string, amount: number, forkApprove: boolean = false): Promise<I_SwapReponse> => {
    if (!walletClient) {
      const result: I_SwapReponse = {
        status: 'ERROR',
        result: null,
      }
      return result;
    };
    // format amount
    const amountFormat = ethers.parseUnits(amount.toString());

    const provider = UseGetProvider(walletClient);
    const signer = await UseGetSigner(walletClient);

    if (!forkApprove) {
      // Approve from erc20 token ?
      const tokenContractSend = new ethers.Contract(
        fromAdd,
        erc20Abi,
        provider,
      );
      const tokenContractSendConnect: any = tokenContractSend.connect(signer);
      // check approve
      const checkApproveMethod = tokenContractSendConnect.allowance;
      const resultCheck = await checkApproveMethod(...[userAddress, UNI_SWAP_CONFIG.SWAP_ROUTER]);
      const resultCheckValue = ethers.formatEther(resultCheck);

      const isApproved = Number(resultCheckValue) >= Number(ethers.formatEther(amountFormat));
      // const isApproved = false;
      if (!isApproved) {
        const approveMethod = tokenContractSendConnect.approve;
        const tx = await approveMethod(UNI_SWAP_CONFIG.SWAP_ROUTER, ethers.parseUnits((amount * 10000).toString()));
        const result: I_SwapReponse = {
          status: 'APPROVING',
          result: tx,
        }
        return result;
      }
    }

    const params = {
      tokenIn: fromAdd, // Token From Address
      tokenOut: toAdd, // Token Send To Address
      fee: UNI_SWAP_CONFIG.FEE,
      recipient: userAddress,
      deadline: Math.floor(Date.now() / 1000) + (60 * 10),
      amountIn: amountFormat,
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0,
    }

    const swapRouterContract: any = new ethers.Contract(
      UNI_SWAP_CONFIG.SWAP_ROUTER,
      SwapRouterABI,
      provider,
    );
    const transaction = await swapRouterContract.connect(signer).exactInputSingle(
      params,
    );
    const result: I_SwapReponse = {
      status: 'SUCCESS',
      result: transaction,
    }
    return result;
  }

  return {
    UseSwap,
  }
}

export default useUniswapHooks;
