import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  selectedItem: null,
  loading: false,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
    setInventoryLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setItems, setSelectedItem, setInventoryLoading } = inventorySlice.actions;
export default inventorySlice.reducer;
