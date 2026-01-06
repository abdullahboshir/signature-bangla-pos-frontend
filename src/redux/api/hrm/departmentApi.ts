import { tagTypes } from "../../tag-types";
import { baseApi } from "../base/baseApi";

const departmentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createDepartment: build.mutation({
      query: (data: unknown) => ({
        url: "/hrm/departments",
        method: "POST",
        contentType: "application/json",
        data,
      }),
      invalidatesTags: [tagTypes.department],
    }),
    getDepartments: build.query({
      query: () => ({
        url: "/hrm/departments",
        method: "GET",
      }),
      providesTags: [tagTypes.department],
    }),
    getDepartment: build.query({
      query: (id: string) => ({
        url: `/hrm/departments/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.department],
    }),
    updateDepartment: build.mutation({
      query: (data: { id: string; body: unknown }) => ({
        url: `/hrm/departments/${data?.id}`,
        method: "PATCH",
        contentType: "application/json",
        data: data.body,
      }),
      invalidatesTags: [tagTypes.department],
    }),
    deleteDepartment: build.mutation({
      query: (id: string) => ({
        url: `/hrm/departments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.department],
    }),
  }),
});

export const { 
  useCreateDepartmentMutation, 
  useGetDepartmentsQuery,
  useGetDepartmentQuery,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation
} = departmentApi;

