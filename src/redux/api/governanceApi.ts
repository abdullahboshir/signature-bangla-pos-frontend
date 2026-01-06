import { apiSlice } from "../apiSlice";

export const governanceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Shareholders
    createShareholder: builder.mutation({
      query: (data) => ({
        url: "/governance/shareholders",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["shareholder"],
    }),
    getAllShareholders: builder.query({
      query: (params) => ({
        url: "/governance/shareholders",
        params,
      }),
      providesTags: ["shareholder"],
    }),
    updateShareholder: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/governance/shareholders/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["shareholder"],
    }),
    deleteShareholder: builder.mutation({
      query: (id) => ({
        url: `/governance/shareholders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["shareholder"],
    }),

    // Voting (Proposals)
    createProposal: builder.mutation({
      query: (data) => ({
        url: "/governance/voting",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["voting"],
    }),
    getAllProposals: builder.query({
      query: (params) => ({
        url: "/governance/voting",
        params,
      }),
      providesTags: ["voting"],
    }),
    castVote: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/governance/voting/${id}/vote`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["voting"],
    }),

    // Meetings
    createMeeting: builder.mutation({
      query: (data) => ({
        url: "/governance/meetings",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["meeting"],
    }),
    getAllMeetings: builder.query({
      query: (params) => ({
        url: "/governance/meetings",
        params,
      }),
      providesTags: ["meeting"],
    }),

    // Compliance
    uploadComplianceDoc: builder.mutation({
      query: (data) => ({
        url: "/governance/compliance",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["compliance"],
    }),
    getAllComplianceDocs: builder.query({
      query: (params) => ({
        url: "/governance/compliance",
        params,
      }),
      providesTags: ["compliance"],
    }),
    deleteComplianceDoc: builder.mutation({
      query: (id) => ({
        url: `/governance/compliance/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["compliance"],
    }),
  }),
});

export const {
  useCreateShareholderMutation,
  useGetAllShareholdersQuery,
  useUpdateShareholderMutation,
  useDeleteShareholderMutation,
  useCreateProposalMutation,
  useGetAllProposalsQuery,
  useCastVoteMutation,
  useCreateMeetingMutation,
  useGetAllMeetingsQuery,
  useUploadComplianceDocMutation,
  useGetAllComplianceDocsQuery,
  useDeleteComplianceDocMutation
} = governanceApi;
