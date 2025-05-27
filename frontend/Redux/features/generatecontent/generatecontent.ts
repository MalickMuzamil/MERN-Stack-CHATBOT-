import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

interface ContentItem {
    id: string;
    prompt: string;
    response: string;
}

interface ChatData {
    _id: string;
    title: string;
    messages: {
        sender: 'user' | 'ai';
        content: string;
        _id: string;
        timestamp: string;
    }[];
}

interface ContentState {
    contents: ContentItem[];
    currentChat: ChatData | null;
    loading: boolean;
    error: string | null;
}

const initialState: ContentState = {
    contents: [],
    currentChat: null,
    loading: false,
    error: null,
};

export const generateContent = createAsyncThunk(
    'content/generate',
    async (data: { prompt: string; chatId?: string | null }, thunkAPI) => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token) {
            return thunkAPI.rejectWithValue('User not authenticated. Token missing.');
        }

        if (!userId) {
            return thunkAPI.rejectWithValue('User ID is missing.');
        }

        try {
            const payload = {
                ...data,
                userId: userId
            };

            const res = await axios.post(
                `${BASE_URL}/generate-content`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return res.data;
        }

        catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchContents = createAsyncThunk(
    'content/fetchContents',
    async (_, thunkAPI) => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token) {
            return thunkAPI.rejectWithValue('User not authenticated. Token missing.');
        }

        if (!userId) {
            return thunkAPI.rejectWithValue('User ID is missing.');
        }

        try {
            const res = await axios.get(`${BASE_URL}/generate-content/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Defensive: ensure data.data is an array, else return empty array
            if (Array.isArray(res.data.data)) {
                return res.data.data;
            } else {
                console.warn('fetchContents: API response data.data is not an array:', res.data.data);
                return [];
            }
        } 
        
        catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchChatById = createAsyncThunk(
    'content/fetchChatById',
    async (chatId: string, thunkAPI) => {
        try {
            const res = await axios.get(`${BASE_URL}/generate-content/${chatId}`);
            return res.data; // expects { messages, title, _id }
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateContent = createAsyncThunk(
    'content/update',
    async (data: { id: string; prompt: string }, thunkAPI) => {
        try {
            const res = await axios.put(`${BASE_URL}/generate-content/${data.id}`, { prompt: data.prompt });
            return res.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deleteContent = createAsyncThunk(
    'content/delete',
    async (id: string, thunkAPI) => {
        try {
            await axios.delete(`${BASE_URL}/generate-content/${id}`);
            return id;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Slice
const contentSlice = createSlice({
    name: 'content',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(generateContent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(generateContent.fulfilled, (state, action) => {
                state.loading = false;
                state.contents.push(action.payload);
            })
            .addCase(generateContent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchContents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContents.fulfilled, (state, action) => {
                state.loading = false;
                if (Array.isArray(action.payload)) {
                    state.contents = action.payload;
                } else {
                    console.warn('fetchContents.fulfilled payload is not array:', action.payload);
                    state.contents = [];
                }
            })
            .addCase(fetchContents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.contents = []; // clear contents on error
            })

            .addCase(fetchChatById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchChatById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentChat = action.payload;
            })
            .addCase(fetchChatById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateContent.fulfilled, (state, action) => {
                const index = state.contents.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.contents[index] = action.payload;
                }
            })
            .addCase(updateContent.rejected, (state, action) => {
                state.error = action.payload as string;
            })

            .addCase(deleteContent.fulfilled, (state, action) => {
                state.contents = state.contents.filter(item => item.id !== action.payload);
            })
            .addCase(deleteContent.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export default contentSlice.reducer;
