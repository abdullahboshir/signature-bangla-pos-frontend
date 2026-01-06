import { baseApi } from "../../api/base/baseApi";
import { tagTypes } from "../../tag-types";

export const packageApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPackages: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/platform/packages",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.package],
    }),
    createPackage: build.mutation({
      query: (data) => ({
        url: "/platform/packages",
        method: "POST",
        data: data,
      }),
      invalidatesTags: [tagTypes.package],
    }),
    updatePackage: build.mutation({
      query: (data) => ({
        url: `/platform/packages/${data.id}`,
        method: "PATCH",
        data: data.body,
      }),
      invalidatesTags: [tagTypes.package],
    }),
    deletePackage: build.mutation({
      query: (id) => ({
        url: `/platform/packages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.package],
    }),
  }),
});

export const {
  useGetPackagesQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} = packageApi;
