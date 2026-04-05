import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "lifeFlow",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:9000/api/auth",
    credentials: "include",
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    registration: builder.mutation({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    login: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
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

    updateStatus: builder.mutation({
      // Use an object to pass multiple values
      query: ({ id, status }) => ({
        url: `/users/status/${id}`,
        method: "PATCH",
        // Ensure the key matches 'status' to match your backend 'const { status } = req.body'
        body: { status },
      }),
    }),

    updateRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/users/role/${id}`,
        method: "PATCH",
        body: { role },
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useRegistrationMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useGetAllUsersQuery,
  useUpdateStatusMutation,
  useUpdateRoleMutation,
  useDeleteUserMutation,
} = authApi;
