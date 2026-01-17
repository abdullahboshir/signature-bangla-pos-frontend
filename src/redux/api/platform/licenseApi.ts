import { baseApi } from "../../api/base/baseApi";
import { tagTypes } from "../../tag-types";

export const licenseApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getLicenses: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/platform/licenses",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.license],
    }),
    getLicenseById: build.query({
      query: (id) => ({
        url: `/platform/licenses/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.license],
    }),
    createLicense: build.mutation({
      query: (data) => ({
        url: "/platform/licenses",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [tagTypes.license, tagTypes.organization],
    }),
    updateLicense: build.mutation({
      query: (data) => ({
        url: `/platform/licenses/${data.id}`,
        method: "PATCH",
        data: data.body,
      }),
      invalidatesTags: [tagTypes.license, tagTypes.organization],
    }),
    deleteLicense: build.mutation({
      query: (id) => ({
        url: `/platform/licenses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.license, tagTypes.organization],
    }),
  }),
});

export const {
  useGetLicensesQuery,
  useGetLicenseByIdQuery,
  useCreateLicenseMutation,
  useUpdateLicenseMutation,
  useDeleteLicenseMutation,
} = licenseApi;
