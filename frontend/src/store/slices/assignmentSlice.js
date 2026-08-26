import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  assignments: [],
  loading: false,
};

const assignmentSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    setAssignments: (state, action) => {
      state.assignments = action.payload;
    },
    setAssignmentLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setAssignments, setAssignmentLoading } = assignmentSlice.actions;
export default assignmentSlice.reducer;
