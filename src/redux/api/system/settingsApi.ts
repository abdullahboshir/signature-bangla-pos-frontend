import { tagTypes } from "../../tag-types";
import { baseApi } from "../base/baseApi";
import { 
  ISystemSettings, 
  IPlatformSettings, 
  ICompanySettings, 
  IBusinessUnitSettings, 
  IOutletSettings 
} from "../../../types/settings";

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // 1. System Settings (Platform-Internal)
    getSystemSettings: build.query<ISystemSettings, void>({
      query: () => ({
        url: `/super-admin/system-settings`,
        method: "GET",
      }),
      providesTags: [tagTypes.settings],
      transformResponse: (response: any) => response.data,
    }),

    updateSystemSettings: build.mutation<ISystemSettings, Partial<ISystemSettings>>({
      query: (data) => ({
        url: `/super-admin/system-settings`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: [tagTypes.settings],
    }),

    // 2. Platform Settings (Global Governance)
    getPlatformSettings: build.query<IPlatformSettings, void>({
      query: () => ({
        url: `/super-admin/platform-settings`,
        method: "GET",
      }),
      providesTags: [tagTypes.settings],
      transformResponse: (response: any) => response.data,
    }),

    updatePlatformSettings: build.mutation<IPlatformSettings, Partial<IPlatformSettings>>({
      query: (data) => ({
        url: `/super-admin/platform-settings`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: [tagTypes.settings],
    }),

    // 3. Company Settings
    getCompanySettings: build.query<ICompanySettings, string>({
      query: (companyId: string) => ({
        url: `/companies/${companyId}/settings`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: tagTypes.settings, id }],
      transformResponse: (response: any) => response.data,
    }),

    updateCompanySettings: build.mutation<ICompanySettings, { companyId: string, data: Partial<ICompanySettings> }>({
      query: ({ companyId, data }) => ({
        url: `/companies/${companyId}/settings`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: tagTypes.settings, id: arg.companyId }],
    }),

    // 4. Business Unit Settings
    getBusinessUnitSettings: build.query<IBusinessUnitSettings, string>({
      query: (businessUnitId: string) => ({
        url: `/business-units/${businessUnitId}/settings`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: tagTypes.settings, id }],
      transformResponse: (response: any) => response.data,
    }),

    updateBusinessUnitSettings: build.mutation<IBusinessUnitSettings, { businessUnitId: string, data: Partial<IBusinessUnitSettings> }>({
      query: ({ businessUnitId, data }) => ({
        url: `/business-units/${businessUnitId}/settings`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: tagTypes.settings, id: arg.businessUnitId }],
    }),

    // 5. Outlet Settings
    getOutletSettings: build.query<IOutletSettings, string>({
      query: (outletId: string) => ({
        url: `/outlets/${outletId}/settings`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: tagTypes.settings, id }],
      transformResponse: (response: any) => response.data,
    }),

    updateOutletSettings: build.mutation<IOutletSettings, { outletId: string, data: Partial<IOutletSettings> }>({
      query: ({ outletId, data }) => ({
        url: `/outlets/${outletId}/settings`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: tagTypes.settings, id: arg.outletId }],
    }),
  }),
});

export const {
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
  useGetPlatformSettingsQuery,
  useUpdatePlatformSettingsMutation,
  useGetCompanySettingsQuery,
  useUpdateCompanySettingsMutation,
  useGetBusinessUnitSettingsQuery,
  useUpdateBusinessUnitSettingsMutation,
  useGetOutletSettingsQuery,
  useUpdateOutletSettingsMutation,
} = settingsApi;
