import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import { setLoading, setError, setCredentials, logout as logoutAction, setInitialized } from '../Redux/auth.slice';
import authService from '../services/auth.service';
import { tokenStore } from '../../../App/api';
import { type LoginDto, type RegisterDto } from '../DTO/auth.dto';

/** Pull the best available error message out of an axios error. */
const extractError = (err: any, fallback: string): string =>
    err?.response?.data?.error || err?.response?.data?.message || err?.message || fallback;

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, isAuthenticated, isLoading, error, isInitialized } = useSelector(
        (state: RootState) => state.auth
    );

    const login = async (data: LoginDto) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const response = await authService.loginUser(data);
            if (response.success) {
                if (response.token) tokenStore.set(response.token);
                dispatch(setCredentials({ user: response.user }));
                return true;
            } else {
                dispatch(setError(response.message || 'Login failed'));
                return false;
            }
        } catch (err: any) {
            dispatch(setError(extractError(err, 'An error occurred during login')));
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const register = async (data: RegisterDto) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const response = await authService.registerUser(data);
            if (response.success) {
                if (response.token) tokenStore.set(response.token);
                dispatch(setCredentials({ user: response.user }));
                return true;
            } else {
                dispatch(setError(response.message || 'Registration failed'));
                return false;
            }
        } catch (err: any) {
            dispatch(setError(extractError(err, 'An error occurred during registration')));
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const logoutUser = async () => {
        try {
            dispatch(setLoading(true));
            await authService.logoutUser();
        } catch (err) {
            console.error('Logout error', err);
        } finally {
            tokenStore.clear();
            dispatch(logoutAction());
            dispatch(setLoading(false));
        }
    };

    /**
     * Restore the session on app boot: if a token is stored, fetch the current
     * user. Always flips `isInitialized` so route guards can stop waiting.
     */
    const initializeAuth = async () => {
        if (!tokenStore.get()) {
            dispatch(setInitialized(true));
            return;
        }
        try {
            const response = await authService.getMe();
            if (response.success) {
                dispatch(setCredentials({ user: response.user }));
            } else {
                tokenStore.clear();
            }
        } catch {
            // token invalid/expired — interceptor already cleared it
            tokenStore.clear();
        } finally {
            dispatch(setInitialized(true));
        }
    };

    return {
        user,
        isAuthenticated,
        isLoading,
        error,
        isInitialized,
        login,
        register,
        logout: logoutUser,
        initializeAuth,
    };
};
