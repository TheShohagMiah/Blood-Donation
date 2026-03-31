import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "lifeFlow",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:9000/api/auth",
    credentials: "include", // ⚡️ Keep this for cookies
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    userRegistration: builder.mutation({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),
    }),

    userLogin: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
      // Login should also invalidate old user data to prevent cache bleeding
      invalidatesTags: ["User"],
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    getMe: builder.query({
      query: () => "/me",
      // ⚡️ This connects this query to the "User" tag system
      providesTags: ["User"],
    }),

    getAllUsers: builder.query({
      query: () => "/users",
      providesTags: ["User"],
    }),
  }),
});

export const {
  useUserRegistrationMutation,
  useUserLoginMutation,
  useLogoutMutation, // Updated name
  useGetMeQuery,
  useGetAllUsersQuery,
} = authApi;
