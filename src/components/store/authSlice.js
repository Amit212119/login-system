import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginUserService, registerUserService } from './authService';
const axios = require('axios');


export const registerUser = createAsyncThunk('auth/register', async (formData, { rejectWithValue }) => {
  try {
    return await registerUserService(formData);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const loginUser = createAsyncThunk('auth/login', async (formData, { rejectWithValue }) => {
  try {
   return await loginUserService(formData);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('user');
  return null;
});
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (updatedData, { rejectWithValue, getState }) => {
    try {
      const { user } = getState().auth; // Get current logged-in user
      if (!user) return rejectWithValue('User not found');

      const res = await axios.put(`http://localhost:5000/register/${user.id}`, updatedData);

      localStorage.setItem('user', JSON.stringify(res.data)); // Update local storage
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Update failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: !!localStorage.getItem('user'),
    isLoading: false,
    error: null,
    message: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const {userData, msg} = action.payload;
        state.isLoading = false;
        state.user = userData;
        state.isAuthenticated = true;
        state.message = msg;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { isAuth, userData, msg, isErr } = action.payload;
        state.isLoading = false;
        state.user = userData;
        state.isAuthenticated = isAuth;
        state.message = msg;
        state.error = isErr;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
