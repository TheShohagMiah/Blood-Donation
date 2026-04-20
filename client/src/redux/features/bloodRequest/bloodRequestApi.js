import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bloodRequestApi = createApi({
  reducerPath: "bloodRequestApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:9000/api/requests",
    prepareHeaders: (headers, { getState }) => {
      // Access auth token if available, but allow guest requests
      const token = getState().auth?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
    credentials: "include",
  }),
  // Fixed property name: tagTypes (lowercase 't')
  tagTypes: ["BloodRequests"],

  endpoints: (builder) => ({
    getAllBloodRequests: builder.query({
      query: () => "/",
    }),

    getPendingRequests: builder.query({
      query: () => "/pending",
    }),

    createBloodRequest: builder.mutation({
      queryFn: async (requestData, _api, _extraOptions, baseQuery) => {
        if (requestData.website) {
          return { error: { status: "CUSTOM_ERROR", error: "Bot detected" } };
        }
        return baseQuery({ url: "/", method: "POST", body: requestData });
      },
      invalidatesTags: [{ type: "BloodRequests", id: "LIST" }],
    }),

    getBloodRequestById: builder.query({
      query: (id) => `/${id}`,
    }),

    getOwnBloodRequests: builder.query({
      query: () => "/my-requests",
    }),

    updateBloodRequest: builder.mutation({
      query: ({ id, ...requestData }) => ({
        url: `/${id}`,
        method: "PUT",
        body: requestData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "BloodRequests", id },
        { type: "BloodRequests", id: "LIST" },
      ],
    }),

    deleteBloodRequest: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "BloodRequests", id: "LIST" }],
    }),

    getRequestAnalytics: builder.query({
      query: (range = "daily") => ({
        url: `/analytics/requests?range=${range}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllBloodRequestsQuery,
  useGetPendingRequestsQuery,
  useCreateBloodRequestMutation,
  useUpdateBloodRequestMutation,
  useDeleteBloodRequestMutation,
  useGetBloodRequestByIdQuery,
  useGetOwnBloodRequestsQuery,
  useGetRequestAnalyticsQuery,
} = bloodRequestApi;
