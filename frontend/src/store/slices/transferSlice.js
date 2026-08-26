import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  transfers: [],
  loading: false,
};

const transferSlice = createSlice({
  name: 'transfers',
  initialState,
  reducers: {
    setTransfers: (state, action) => {
      state.transfers = action.payload;
    },
    setTransferLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setTransfers, setTransferLoading } = transferSlice.actions;
export default transferSlice.reducer;
