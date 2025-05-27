import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

interface SignupState {
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: SignupState = {
    loading: false,
    error: null,
    success: false,
};

export const signupUser = createAsyncThunk(
    'auth/signupUser',
    async (
        userData: { first_name: string; last_name: string; password: string; email: string },
        thunkAPI
    ) => {
        try {
            const response = await fetch(`${BASE_URL}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Signup failed');
            }

            return data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const signupSlice = createSlice({
    name: 'signup',
    initialState,
    reducers: {
        resetSignupState(state) {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(signupUser.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.success = false;
            });
    },
});

export const { resetSignupState } = signupSlice.actions;
export default signupSlice.reducer;
