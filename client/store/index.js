import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from '../features/fetchData';

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});
