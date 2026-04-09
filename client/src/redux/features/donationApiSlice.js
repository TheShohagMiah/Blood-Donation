import apiSlice from "./apiSlice";

const donationUrl = "donations";
const donationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllDonations: builder.query({
      query: () => donationUrl,
    }),

    createDonation: builder.mutation({
      query: ({ donationData }) => ({
        url: donationUrl,
        method: "POST",
        body: donationData,
      }),
    }),
  }),
});

export const { useGetAllDonationsQuery, useCreateDonationMutation } =
  donationApiSlice;
