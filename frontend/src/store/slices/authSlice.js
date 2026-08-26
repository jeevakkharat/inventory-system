import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: localStorage.getItem('auth_token') || null,
  isAuthenticated: !!localStorage.getItem('auth_token'),
  rememberMe: !!localStorage.getItem('remember_me'),
  isDemo: localStorage.getItem('auth_token') === 'demo-jwt-token',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, rememberMe, isDemo = token === 'demo-jwt-token' } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.rememberMe = rememberMe;
      state.isDemo = isDemo;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('remember_me', rememberMe ? 'true' : 'false');
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.rememberMe = false;
      state.isDemo = false;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('remember_me');
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isDemo = Boolean(action.payload?.isDemo || state.token === 'demo-jwt-token');
    },
  },
});

export const { setCredentials, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
