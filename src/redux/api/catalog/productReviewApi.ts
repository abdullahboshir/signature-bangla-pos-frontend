import { baseApi } from "../base/baseApi";
import { tagTypes } from "../../tag-types";

export const productReviewApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createReview: build.mutation({
      query: (data) => ({
        url: "/super-admin/reviews",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.productReview],
    }),
    
    getReviewsForProduct: build.query({
      query: ({ productId, ...params }) => ({
        url: `/super-admin/reviews/product/${productId}`,
        method: "GET",
        params: params,
      }),
      providesTags: [tagTypes.productReview],
    }),
    
    getAllReviews: build.query({
      query: (params) => ({
        url: "/super-admin/reviews",
        method: "GET",
        params: params,
      }),
      providesTags: [tagTypes.productReview],
    }),
    
    updateReviewStatus: build.mutation({
      query: ({ id, status }) => ({
        url: `/super-admin/reviews/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: [tagTypes.productReview],
    }),
    
    replyToReview: build.mutation({
      query: ({ id, response }) => ({
        url: `/super-admin/reviews/${id}/reply`,
        method: "PATCH",
        body: { response },
      }),
      invalidatesTags: [tagTypes.productReview],
    }),
    
    deleteReview: build.mutation({
      query: (id) => ({
        url: `/super-admin/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.productReview],
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useGetReviewsForProductQuery,
  useGetAllReviewsQuery,
  useUpdateReviewStatusMutation,
  useReplyToReviewMutation,
  useDeleteReviewMutation
} = productReviewApi;

