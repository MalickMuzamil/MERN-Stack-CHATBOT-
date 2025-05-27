import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
import axios from 'axios';

interface LoginState {
    user: string | null;
    role: string | null;
    userId: string | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: LoginState = {
    user: null,
    role: null,
    userId: null,
    token: null,
    loading: false,
    error: null,
};

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials: { email: string; password: string }, thunkAPI) => {
        try {
            const response = await axios.post(`${BASE_URL}/login`, credentials);
            const data = response.data;
            console.log(data);
            return {
                token: data.auth_token,
                role: data.data.role,
                userId: data.data._id,
            };

        }

        catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const loginslice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        logout(state) {
            state.role = null;
            state.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('role');
        },
        loadUserFromStorage(state) {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role');
            if (token && role) {
                state.token = token;
                state.role = role;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userId = action.payload.userId;
                state.role = action.payload.role;
                state.token = action.payload.token;

                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('role', action.payload.role);
                localStorage.setItem('userId', action.payload.userId);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || 'Something went wrong';
            });
    },
});

export const { logout, loadUserFromStorage } = loginslice.actions;
export default loginslice.reducer;
