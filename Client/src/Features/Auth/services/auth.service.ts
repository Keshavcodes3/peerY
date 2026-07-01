import { api, ENDPOINT } from "../../../App/api";
import type { RegisterDto, LoginDto, AuthResponseDto, UserDto } from "../DTO/auth.dto";


const registerUser = async (userData: RegisterDto): Promise<AuthResponseDto> => {
    const response = await api.post(ENDPOINT.auth.register, userData);
    return response.data;
};

const loginUser = async (userData: LoginDto): Promise<AuthResponseDto> => {
    const response = await api.post(ENDPOINT.auth.login, userData);
    return response.data;
};

const getMe = async (): Promise<{ success: boolean; user: UserDto }> => {
    const response = await api.get(ENDPOINT.auth.me);
    return response.data;
};

const logoutUser = async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.post(ENDPOINT.auth.logout);
    return response.data;
};

const disableAccount = async (): Promise<{ success: boolean; message: string; user: UserDto }> => {
    const response = await api.put(ENDPOINT.auth.disable);
    return response.data;
};

const deleteAccount = async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(ENDPOINT.auth.delete);
    return response.data;
};

const authService = {
    registerUser,
    loginUser,
    getMe,
    logoutUser,
    disableAccount,
    deleteAccount
};

export default authService;