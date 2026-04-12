import apiSlice from "../apiSlice";

const donationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createDonation: builder.mutation({
      query: (data) => ({
        url: "/donations",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Donation"],
    }),
    getAllDonations: builder.query({
      query: () => "/donations",
      providesTags: ["Donation"],
    }),
    getDonationsByUser: builder.query({
      query: () => "/donations/my-donations",
      providesTags: ["Donation"],
    }),

    updateDonationStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/donations/status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Donations"],
    }),
    deleteDonation: builder.mutation({
      query: (id) => ({ url: `/donations/${id}`, method: "DELETE" }),
      invalidatesTags: ["Donations"],
    }),
  }),
});

export const {
  useCreateDonationMutation,
  useGetAllDonationsQuery,
  useGetDonationsByUserQuery,
  useUpdateDonationStatusMutation,
  useDeleteDonationMutation,
} = donationApi;
