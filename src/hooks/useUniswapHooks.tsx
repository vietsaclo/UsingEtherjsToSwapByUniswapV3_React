import useWalletConnected from "./useWalletConnected";
import { UNI_SWAP_CONFIG } from "../utils/Consts";
import { I_SesstionUser, I_SwapReponse } from "../utils/Interfaces";
import { ethers } from "ethers";
import { useSelector } from "react-redux";

const erc20Abi = require('../utils/json/Erc20abi.json');
const { abi: SwapRouterABI } = require('@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json')

const useUniswapHooks = () => {
  const { UseGetProvider, UseGetSigner } = useWalletConnected();
  const sessionUserReducer: I_SesstionUser = useSelector((state: any) => state.sessionUser);

  const UseSwap = async (fromAdd: string, toAdd: string, amount: number, forkApprove: boolean = false): Promise<I_SwapReponse> => {
    const provider = await UseGetProvider();
    const signer = await UseGetSigner();

    if (!provider || !signer) {
      const result: I_SwapReponse = {
        status: 'ERROR',
        result: null,
      }
      return result;
    };
    // format amount
    const amountFormat = ethers.utils.parseUnits(amount.toString());

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
      const resultCheck = await checkApproveMethod(...[sessionUserReducer.account, UNI_SWAP_CONFIG.SWAP_ROUTER]);
      const resultCheckValue = ethers.utils.formatEther(resultCheck);

      const isApproved = Number(resultCheckValue) >= Number(ethers.utils.formatEther(amountFormat));
      // const isApproved = false;
      if (!isApproved) {
        const approveMethod = tokenContractSendConnect.approve;
        const tx = await approveMethod(UNI_SWAP_CONFIG.SWAP_ROUTER, ethers.utils.parseUnits((amount * 10000).toString()));
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
      recipient: sessionUserReducer.account,
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
