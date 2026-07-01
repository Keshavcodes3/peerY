import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import { setLoading, setError, setCredentials, logout as logoutAction } from '../Redux/auth.slice';
import authService from '../services/auth.service';
import { type LoginDto, type RegisterDto } from '../DTO/auth.dto';

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, isAuthenticated, isLoading, error } = useSelector((state: RootState) => state.auth);

    const login = async (data: LoginDto) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const response = await authService.loginUser(data);
            if (response.success) {
                dispatch(setCredentials({ user: response.user }));
                return true;
            } else {
                dispatch(setError(response.message || 'Login failed'));
                return false;
            }
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || 'An error occurred during login';
            dispatch(setError(message));
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
                dispatch(setCredentials({ user: response.user }));
                return true;
            } else {
                dispatch(setError(response.message || 'Registration failed'));
                return false;
            }
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || 'An error occurred during registration';
            dispatch(setError(message));
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    };

    const logoutUser = async () => {
        try {
            dispatch(setLoading(true));
            await authService.logoutUser();
            dispatch(logoutAction());
        } catch (err) {
            console.error('Logout error', err);
        } finally {
            dispatch(setLoading(false));
        }
    };

    return {
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout: logoutUser
    };
};
