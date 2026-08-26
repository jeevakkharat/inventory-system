import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
  selectedUser: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.list = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setUserLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setUsers, setSelectedUser, setUserLoading } = userSlice.actions;
export default userSlice.reducer;
