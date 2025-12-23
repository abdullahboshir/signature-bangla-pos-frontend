import { tagTypes } from "../tag-types";
import { baseApi } from "./base/baseApi";

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getBusinessUnitSettings: build.query({
      query: (businessUnitId: string) => ({
        url: `/super-admin/settings/${businessUnitId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: tagTypes.settings, id }],
      transformResponse: (response: any) => response.data,
    }),

    updateBusinessUnitSettings: build.mutation({
      query: (data) => ({
        url: `/super-admin/settings/${data.businessUnitId}`,
        method: "PATCH",
        data: data.body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: tagTypes.settings, id: arg.businessUnitId },
      ],
    }),

    getSystemSettings: build.query({
      query: () => ({
        url: `/system-settings`,
        method: "GET",
      }),
      providesTags: [tagTypes.settings],
      transformResponse: (response: any) => response.data,
    }),

    updateSystemSettings: build.mutation({
      query: (data) => ({
        url: `/system-settings`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: [tagTypes.settings],
    }),
  }),
});

export const {
  useGetBusinessUnitSettingsQuery,
  useUpdateBusinessUnitSettingsMutation,
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
} = settingsApi;
