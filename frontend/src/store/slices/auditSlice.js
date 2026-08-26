import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  logs: [],
  loading: false,
};

const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {
    setAuditLogs: (state, action) => {
      state.logs = action.payload;
    },
    setAuditLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setAuditLogs, setAuditLoading } = auditSlice.actions;
export default auditSlice.reducer;
