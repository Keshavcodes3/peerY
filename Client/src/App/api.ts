import axios from 'axios'

const TOKEN_KEY = 'peerY_token'

/** Small wrapper around localStorage for the JWT. */
export const tokenStore = {
    get: (): string | null => localStorage.getItem(TOKEN_KEY),
    set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
    clear: (): void => localStorage.removeItem(TOKEN_KEY),
}

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/",
    withCredentials: true
})

// Attach the JWT as a Bearer token on every request (verifyAuth accepts this).
api.interceptors.request.use((config) => {
    const token = tokenStore.get()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Drop a stale token if the server rejects it.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            tokenStore.clear()
        }
        return Promise.reject(error)
    }
)



export const ENDPOINT = {
    auth: {
        register: '/api/v1/auth/register',
        login: '/api/v1/auth/login',
        me: "/api/v1/auth/me",
        logout: "/api/v1/auth/logout",
        delete: "/api/v1/auth/delete",
        disable: "/api/v1/auth/disable"
    },
    discover: {
        profiles: '/api/v1/discover/profile',
    },
    match: {
        like: (userId: string) => `/api/v1/match/like/${userId}`,
        accept: (matchId: string) => `/api/v1/match/${matchId}/accept`,
        reject: (matchId: string) => `/api/v1/match/${matchId}/reject`,
        unmatch: (matchId: string) => `/api/v1/match/${matchId}/unmatch`,
        getAll: '/api/v1/match',
        pending: '/api/v1/match/pending'
    }
}