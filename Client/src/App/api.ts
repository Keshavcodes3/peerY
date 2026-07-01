import axios from 'axios'


export const api = axios.create({
    baseURL: "http://localhost:3000/",
    withCredentials: true
})



export const ENDPOINT = {
    auth: {
        register: '/api/v1/auth/register',
        login: '/api/v1/auth/login',
        me: "/api/v1/auth/me",
        logout: "/api/v1/auth/logout",
        delete: "/api/v1/auth/delete",
        disable: "/api/v1/auth/disable"
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