import { tagTypes } from "../tag-types";
import { baseApi } from "./base/baseApi";

const customerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createCustomer: build.mutation({
      query: (data: unknown) => ({
        url: "/customer/createCustomer",
        method: "POST",
        contentType: "application/json",
        data,
      }),
      invalidatesTags: [tagTypes.customer],
    }),
    getCustomers: build.query({
      query: () => ({
        url: "/customer/getCustomers",
        method: "GET",
      }),
      providesTags: [tagTypes.customer],
    }),
    getCustomer: build.query({
      query: (id: string) => ({
        url: `/customer/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.customer],
    }),
    updateCustomer: build.mutation({
      query: (data: { id: string; body: unknown }) => ({
        url: `/customer/${data?.id}`,
        method: "PATCH",
        contentType: "application/json",
        data: data.body,
      }),
      invalidatesTags: [tagTypes.customer],
    }),
    deleteCustomer: build.mutation({
      query: (id: string) => ({
        url: `/customer/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.customer],
    }),
  }),
});

export const { 
  useCreateCustomerMutation, 
  useGetCustomersQuery, 
  useGetCustomerQuery,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation
} = customerApi;
    