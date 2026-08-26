import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  global: false,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setGlobalLoading: (state, action) => {
      state.global = action.payload;
    },
  },
});

export const { setGlobalLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
