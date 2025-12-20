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
  }),
});

export const {
  useGetBusinessUnitSettingsQuery,
  useUpdateBusinessUnitSettingsMutation,
} = settingsApi;
