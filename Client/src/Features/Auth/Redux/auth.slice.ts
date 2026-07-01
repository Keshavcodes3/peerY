import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type UserDto } from '../DTO/auth.dto';

interface AuthState {
    user: UserDto | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
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
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        },
    },
});

export const { setLoading, setError, setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
