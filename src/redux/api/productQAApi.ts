import { baseApi } from "./base/baseApi";
import { tagTypes } from "../tag-types";

export const productQAApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createQuestion: build.mutation({
      query: (data) => ({
        url: "/super-admin/product-questions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.ProductQA],
    }),
    
    getQuestionsForProduct: build.query({
      query: ({ productId, ...params }) => ({
        url: `/super-admin/product-questions/product/${productId}`,
        method: "GET",
        params: params,
      }),
      providesTags: [tagTypes.ProductQA],
    }),
    
    getAllQuestions: build.query({
      query: (params) => ({
        url: "/super-admin/product-questions",
        method: "GET",
        params: params,
      }),
      providesTags: [tagTypes.ProductQA],
    }),
    
    answerQuestion: build.mutation({
      query: ({ id, answer }) => ({
        url: `/super-admin/product-questions/${id}/answer`,
        method: "PATCH",
        body: { answer },
      }),
      invalidatesTags: [tagTypes.ProductQA],
    }),
    
    updateQuestionStatus: build.mutation({
      query: ({ id, status, isPublic }) => ({
        url: `/super-admin/product-questions/${id}/status`,
        method: "PATCH",
        body: { status, isPublic },
      }),
      invalidatesTags: [tagTypes.ProductQA],
    }),
    
    deleteQuestion: build.mutation({
      query: (id) => ({
        url: `/super-admin/product-questions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.ProductQA],
    }),
  }),
});

export const {
  useCreateQuestionMutation,
  useGetQuestionsForProductQuery,
  useGetAllQuestionsQuery,
  useAnswerQuestionMutation,
  useUpdateQuestionStatusMutation,
  useDeleteQuestionMutation
} = productQAApi;
