import { configureStore } from '@reduxjs/toolkit';
// import { useReducer } from 'react';
// import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    // user: user,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
