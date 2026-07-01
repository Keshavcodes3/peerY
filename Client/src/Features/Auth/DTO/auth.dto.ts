export interface RegisterDto {
    username: string;
    email: string;
    password: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface GoogleLoginDto {
    credential: string;
}

export interface UserDto {
    _id?: string;
    userId: string;
    username: string;
    email: string;
    emailVerified: boolean;
    provider: "local" | "github" | "google";
    isDisabled: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponseDto {
    success: boolean;
    message?: string;
    user: UserDto;
    token?: string;
}
