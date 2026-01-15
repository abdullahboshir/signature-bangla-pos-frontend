import { tagTypes } from "../../tag-types";
import { baseApi } from "../base/baseApi";

export const complianceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadComplianceDoc: builder.mutation({
      query: (data) => ({
        url: "/governance/compliance",
        method: "POST",
        body: data,
        // Original governanceApi didn't specify contentType, so it adapts to Body (JSON or FormData)
      }),
      invalidatesTags: [tagTypes.compliance],
    }),
    getAllComplianceDocs: builder.query({
      query: (params) => ({
        url: "/governance/compliance",
        params,
      }),
      providesTags: [tagTypes.compliance],
    }),
    deleteComplianceDoc: builder.mutation({
      query: (id) => ({
        url: `/governance/compliance/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.compliance],
    }),
  }),
});

export const {
  useUploadComplianceDocMutation,
  useGetAllComplianceDocsQuery,
  useDeleteComplianceDocMutation,
} = complianceApi;

export default complianceApi;
