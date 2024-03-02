export interface IDataAxiosResponse {
  success: boolean,
  message?: string,
  result?: any,
  error?: any,
  total?: number,
}

export interface I_SwapReponse {
  status: 'APPROVING' | 'SUCCESS' | 'ERROR',
  result: any,
}

export interface I_SesstionUser {
  account?: string;
  chainId?: number;
}