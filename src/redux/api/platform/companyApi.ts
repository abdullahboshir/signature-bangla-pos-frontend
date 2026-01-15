import { API_ENDPOINTS } from "@/config/api-endpoints";
import { baseApi as apiSlice } from "../base/baseApi";
import { tagTypes } from "@/redux/tag-types";

export const companyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCompanies: builder.query({
      query: (params) => ({
        url: API_ENDPOINTS.PLATFORM.COMPANIES,
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.company],
    }),
    getCompany: builder.query({
      query: (id) => ({
        url: `${API_ENDPOINTS.PLATFORM.COMPANIES}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.company],
    }),
    createCompany: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.PLATFORM.COMPANIES,
        method: "POST",
        data: data,
      }),
      invalidatesTags: [tagTypes.company],
    }),
    updateCompany: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${API_ENDPOINTS.PLATFORM.COMPANIES}/${id}`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: [tagTypes.company],
    }),
    getCompanyDashboardStats: builder.query({
      query: (companyId: string) => ({
        url: `${API_ENDPOINTS.PLATFORM.COMPANIES}/${companyId}/dashboard`,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: (result, error, arg) => [
        { type: tagTypes.company, id: arg },
      ],
    }),
  }),
});

export const {
  useGetAllCompaniesQuery,
  useGetCompanyQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useGetCompanyDashboardStatsQuery,
} = companyApi;
