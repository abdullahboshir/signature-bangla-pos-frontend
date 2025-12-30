import { baseApi } from "../base/baseApi";
import { tagTypes } from "../../tag-types";

export const logisticsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Couriers
    createCourier: build.mutation({
      query: (data) => ({
        url: "/super-admin/logistics/couriers",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.courier],
    }),
    getAllCouriers: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/super-admin/logistics/couriers",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.courier],
    }),
    updateCourier: build.mutation({
      query: ({ id, data }) => ({
        url: `/super-admin/logistics/couriers/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.courier],
    }),
    deleteCourier: build.mutation({
      query: (id) => ({
        url: `/super-admin/logistics/couriers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.courier],
    }),

    // Shipment
    createShipment: build.mutation({
        query: (data) => ({
            url: "/super-admin/logistics/shipments",
            method: "POST",
            body: data
        })
    })
  }),
});

export const {
  useCreateCourierMutation,
  useGetAllCouriersQuery,
  useUpdateCourierMutation,
  useDeleteCourierMutation,
  useCreateShipmentMutation
} = logisticsApi;

