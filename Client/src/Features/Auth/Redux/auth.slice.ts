import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type UserDto } from '../DTO/auth.dto';

interface AuthState {
    user: UserDto | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    // false until the initial session-restore (getMe) has finished
    isInitialized: boolean;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isInitialized: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setCredentials: (state, action: PayloadAction<{ user: UserDto }>) => {
            const u = action.payload.user;
            if (u && u._id && !u.userId) {
                u.userId = u._id;
            }
            state.user = u;
            state.isAuthenticated = true;
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        setInitialized: (state, action: PayloadAction<boolean>) => {
            state.isInitialized = action.payload;
        },
    },
});

export const { setLoading, setError, setCredentials, logout, setInitialized } = authSlice.actions;
export default authSlice.reducer;
