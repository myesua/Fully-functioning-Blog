import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  entities: [],
  loading: false,
};

export const fetchUser: any = createAsyncThunk(
  'app/fetchUser',
  async (user, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${process.env.API_URI}/user/dashboard`, {
        withCredentials: true,
      });
      const data = res.data.user;
      const posts = res.data.posts;
      const tips = res.data.tips;
    } catch (err) {
      return rejectWithValue('Ouch, there seems to be an error.');
    }
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchUser.pending]: (state) => {
      state.loading = true;
    },
    [fetchUser.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.entities = payload;
    },
    [fetchUser.rejected]: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const userReducer = userSlice.reducer;
