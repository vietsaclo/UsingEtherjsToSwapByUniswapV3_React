import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app-store/store";
import { I_SesstionUser } from "../utils/Interfaces";

const initialState: I_SesstionUser = {}

const SessionUserSlice = createSlice({
  name: 'SessionUserReducer',
  initialState: initialState,
  reducers: {
    connectWalletReducer: (state, action: PayloadAction<I_SesstionUser>) => {
      const { account, chainId } = action.payload;
      state.account = account;
      state.chainId = chainId;
    },
    disconnectWalletReducer: (state) => {
      state.account = state.chainId = undefined;
    },
  }
});

export const { connectWalletReducer, disconnectWalletReducer } = SessionUserSlice.actions;

export const selectSessionUser = (state: RootState) => state.sessionUser;

export default SessionUserSlice.reducer;
