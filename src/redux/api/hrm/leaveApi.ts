import { tagTypes } from "../../tag-types";
import { baseApi } from "../base/baseApi";

const leaveApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createLeave: build.mutation({
      query: (data: unknown) => ({
        url: "/hrm/leave",
        method: "POST",
        contentType: "application/json",
        data,
      }),
      invalidatesTags: [tagTypes.attendance], // Maybe add leave tag logic later, currently utilizing generic or shared tags
    }),
    getLeaves: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/hrm/leave",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.attendance],
    }),
    updateLeaveStatus: build.mutation({
      query: (data: { id: string; body: unknown }) => ({
        url: `/hrm/leave/${data?.id}`,
        method: "PATCH",
        contentType: "application/json",
        data: data.body,
      }),
      invalidatesTags: [tagTypes.attendance],
    }),
    deleteLeave: build.mutation({
      query: (id: string) => ({
        url: `/hrm/leave/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.attendance],
    }),
  }),
});

export const { 
  useCreateLeaveMutation, 
  useGetLeavesQuery,
  useUpdateLeaveStatusMutation,
  useDeleteLeaveMutation
} = leaveApi;
