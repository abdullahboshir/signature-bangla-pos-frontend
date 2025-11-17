import { baseApi } from "./base/baseApi";
import { tagTypes } from "../tag-types";

const authApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        login: build.mutation({
            query: (data: { email: string; password: string }) => ({
                url: '/auth/login',
                method: 'POST',
                contentType: 'application/json',
                data
            }),
            invalidatesTags: [tagTypes.auth]
        }),
        register: build.mutation({
            query: (data: unknown) => ({
                url: '/auth/register',
                method: 'POST',
                contentType: 'application/json',
                data
            }),
            invalidatesTags: [tagTypes.auth]
        }),
        logout: build.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
                contentType: 'application/json',
            }),
            invalidatesTags: [tagTypes.auth]
        }),
        refreshToken: build.mutation({
            query: (data: { refreshToken: string }) => ({
                url: '/auth/refresh-token',
                method: 'POST',
                contentType: 'application/json',
                data
            }),
        }),
    }),
});


export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useRefreshTokenMutation
} = authApi;