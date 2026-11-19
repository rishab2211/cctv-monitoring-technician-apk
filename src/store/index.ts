/**
 * @file store/index.ts
 * @description Redux store configuration for Technician Mobile App
 */

import { configureStore } from '@reduxjs/toolkit';
import { technicianApi } from '../api/technicianApi';

export const store = configureStore({
  reducer: {
    [technicianApi.reducerPath]: technicianApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(technicianApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
