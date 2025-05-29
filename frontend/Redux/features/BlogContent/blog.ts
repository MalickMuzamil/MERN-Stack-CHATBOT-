import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

interface PromptState {
    selectedPrompt: string;
    responseData: any;
    blogList: any[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: PromptState = {
    selectedPrompt: '',
    responseData: null,
    blogList: [],
    status: 'idle',
    error: null,
};

// Thunk: Post new blog prompt
export const postPrompt = createAsyncThunk(
    'prompt/postPrompt',
    async (promptText: string, thunkAPI) => {
        try {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');

            const response = await axios.post(
                `${BASE_URL}/generate-blog`,
                { prompt: promptText, userId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const postFollowUp = createAsyncThunk(
    'prompt/postFollowUp',
    async ({ message, chatId }: { message: string; chatId: string }, thunkAPI) => {
        try {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');

            const response = await axios.post(
                `${BASE_URL}/generate-blog`,
                {
                    userResponse: message,
                    userId,
                    chatId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Thunk: Fetch all blog chats for a user
export const fetchUserBlogs = createAsyncThunk(
    'prompt/fetchUserBlogs',
    async (userId: string, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}/generate-blog/all/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deleteBlogChat = createAsyncThunk(
    'prompt/deleteBlogChat',
    async (chatId: string, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${BASE_URL}/generate-blog/blogs/${chatId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return chatId;  // return deleted chatId so we can remove it locally
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Slice
const promptSlice = createSlice({
    name: 'prompt',
    initialState,
    reducers: {
        clearSelectedPrompt(state) {
            state.selectedPrompt = '';
            state.responseData = null;
            state.status = 'idle';
            state.error = null;
        },
        setSelectedPrompt(state, action) {
            state.selectedPrompt = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // postPrompt
            .addCase(postPrompt.pending, (state, action) => {
                state.status = 'loading';
                state.selectedPrompt = action.meta.arg;
                state.error = null;
            })
            .addCase(postPrompt.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.responseData = action.payload;
                state.error = null;
            })
            .addCase(postPrompt.rejected, (state, action) => {
                state.status = 'failed';
                state.responseData = null;
                state.error = action.payload as string;
            })

            // fetchUserBlogs
            .addCase(fetchUserBlogs.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchUserBlogs.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.blogList = action.payload;
                state.error = null;
            })
            .addCase(fetchUserBlogs.rejected, (state, action) => {
                state.status = 'failed';
                state.blogList = [];
                state.error = action.payload as string;
            })

            // deleteBlogChat
            .addCase(deleteBlogChat.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteBlogChat.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.blogList = state.blogList.filter(chat => chat._id !== action.payload);
                state.error = null;
            })
            .addCase(deleteBlogChat.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { clearSelectedPrompt, setSelectedPrompt } = promptSlice.actions;
export default promptSlice.reducer;
