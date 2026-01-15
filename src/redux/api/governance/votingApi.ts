import { tagTypes } from "../../tag-types";
import { createCrudApi } from "../base/createCrudApi";

// 1. Generate CRUD hooks
const { api: votingCrudApi, hooks: crudHooks } = createCrudApi({
  resourceName: "proposal", // Naming it proposal to match 'createProposal' intent, though URL is voting
  baseUrl: "/governance/voting",
  tagType: tagTypes.voting,
});

// 2. Inject custom endpoints (castVote)
const votingApi = votingCrudApi.injectEndpoints({
  endpoints: (builder) => ({
    castVote: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/governance/voting/${id}/vote`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.voting],
    }),
  }),
});

// 3. Export all hooks
export const {
  useCreateProposalMutation,
  useGetProposalsQuery, // Auto-generated from 'proposal'
  useGetProposalQuery,
  useUpdateProposalMutation,
  useDeleteProposalMutation,
} = crudHooks;

export const { useCastVoteMutation } = votingApi;

export default votingApi;
