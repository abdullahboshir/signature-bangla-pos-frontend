import { tagTypes } from "../../tag-types";
import { baseApi } from "../base/baseApi";

const attendanceApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createAttendance: build.mutation({
      query: (data: unknown) => ({
        url: "/hrm/attendance",
        method: "POST",
        contentType: "application/json",
        data,
      }),
      invalidatesTags: [tagTypes.attendance],
    }),
    getAttendance: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/hrm/attendance",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.attendance],
    }),
    getAttendanceById: build.query({
      query: (id: string) => ({
        url: `/hrm/attendance/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.attendance],
    }),
    updateAttendance: build.mutation({
      query: (data: { id: string; body: unknown }) => ({
        url: `/hrm/attendance/${data?.id}`,
        method: "PATCH",
        contentType: "application/json",
        data: data.body,
      }),
      invalidatesTags: [tagTypes.attendance],
    }),
    deleteAttendance: build.mutation({
      query: (id: string) => ({
        url: `/hrm/attendance/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.attendance],
    }),
  }),
});

export const { 
  useCreateAttendanceMutation, 
  useGetAttendanceQuery,
  useGetAttendanceByIdQuery,
  useUpdateAttendanceMutation,
  useDeleteAttendanceMutation
} = attendanceApi;
