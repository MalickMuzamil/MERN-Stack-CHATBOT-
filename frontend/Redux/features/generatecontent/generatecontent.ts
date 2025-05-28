import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

interface Message {
    sender: 'user' | 'ai';
    content: string;
    _id: string;
    timestamp: string;
}

interface ContentItem {
    _id: string;
    prompt?: string;
    response?: string;
    messages?: Message[];
}

interface ChatData {
    _id: string;
    title: string;
    messages: Message[];
}

interface ContentState {
    contents: ContentItem[];
    currentChat: ChatData | null;
    currentChatId: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: ContentState = {
    contents: [],
    currentChat: null,
    currentChatId: null,
    loading: false,
    error: null,
};

// Generate content
export const generateContent = createAsyncThunk(
    'content/generate',
    async (data: { prompt: string; chatId?: string | null }, thunkAPI) => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token) return thunkAPI.rejectWithValue('User not authenticated.');
        if (!userId) return thunkAPI.rejectWithValue('User ID missing.');

        try {
            const res = await axios.post(
                `${BASE_URL}/generate-content`,
                { ...data, userId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Generate new chat content (always create new chat)
export const generateNewChatContent = createAsyncThunk(
    'content/generateNewChat',
    async (data: { prompt: string }, thunkAPI) => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token) return thunkAPI.rejectWithValue('User not authenticated.');
        if (!userId) return thunkAPI.rejectWithValue('User ID missing.');

        try {
            const res = await axios.post(
                `${BASE_URL}/generate-content/new`,
                { ...data, userId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.data;
        } 
        
        catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Fetch all contents
export const fetchContents = createAsyncThunk(
    'content/fetchContents',
    async (_, thunkAPI) => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token) return thunkAPI.rejectWithValue('User not authenticated.');
        if (!userId) return thunkAPI.rejectWithValue('User ID missing.');

        try {
            const res = await axios.get(`${BASE_URL}/generate-content/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return Array.isArray(res.data.data) ? res.data.data : [];
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Fetch a chat by ID
export const fetchChatById = createAsyncThunk(
    'content/fetchChatById',
    async (chatId: string, thunkAPI) => {
        try {
            const res = await axios.get(`${BASE_URL}/generate-content/user/chat/${chatId}`);
            return res.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Delete chat by ID
export const deleteChatById = createAsyncThunk(
    'content/deleteChatById',
    async (chatId: string, thunkAPI) => {
        try {
            const res = await axios.delete(`${BASE_URL}/generate-content/delete-chat/${chatId}`);
            if (!res || res.status !== 200) throw new Error('Failed to delete chat');
            return chatId;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Slice
const contentSlice = createSlice({
    name: 'content',
    initialState,
    reducers: {
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload;
        },
        resetCurrentChatId: (state) => {
            state.currentChatId = null;
            state.currentChat = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Generate content
            .addCase(generateContent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(generateContent.fulfilled, (state, action) => {
                state.loading = false;
                state.contents.push(action.payload);
                state.currentChat = action.payload;
                state.currentChatId = action.payload.data?._id || null;
            })
            .addCase(generateContent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Generate NEW chat (always new)
            .addCase(generateNewChatContent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(generateNewChatContent.fulfilled, (state, action) => {
                state.loading = false;
                state.contents.push(action.payload);
                state.currentChat = action.payload;
                state.currentChatId = action.payload.data?._id || null;
            })
            .addCase(generateNewChatContent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Fetch contents
            .addCase(fetchContents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContents.fulfilled, (state, action) => {
                state.loading = false;
                state.contents = action.payload;
            })
            .addCase(fetchContents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.contents = [];
            })

            // Fetch single chat
            .addCase(fetchChatById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchChatById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentChat = action.payload;
                state.currentChatId = action.payload?._id || null;
            })
            .addCase(fetchChatById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Delete chat
            .addCase(deleteChatById.fulfilled, (state, action) => {
                state.contents = state.contents.filter(item => item._id !== action.payload);
            })
            .addCase(deleteChatById.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export default contentSlice.reducer;
export const { setCurrentChatId, resetCurrentChatId } = contentSlice.actions;
