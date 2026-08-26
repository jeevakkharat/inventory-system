import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  purchases: [],
  loading: false,
};

const purchaseSlice = createSlice({
  name: 'purchases',
  initialState,
  reducers: {
    setPurchases: (state, action) => {
      state.purchases = action.payload;
    },
    setPurchaseLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setPurchases, setPurchaseLoading } = purchaseSlice.actions;
export default purchaseSlice.reducer;
