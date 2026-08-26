import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import inventoryReducer from './slices/inventorySlice';
import purchaseReducer from './slices/purchaseSlice';
import transferReducer from './slices/transferSlice';
import assignmentReducer from './slices/assignmentSlice';
import auditReducer from './slices/auditSlice';
import loadingReducer from './slices/loadingSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    inventory: inventoryReducer,
    purchases: purchaseReducer,
    transfers: transferReducer,
    assignments: assignmentReducer,
    audit: auditReducer,
    loading: loadingReducer,
    notifications: notificationReducer,
  },
});

export default store;
