import { baseApi } from "../../api/base/baseApi";
import { tagTypes } from "../../tag-types";

export const marketingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Coupons
    getCoupons: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/marketing/coupons",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.coupon],
    }),
    createCoupon: build.mutation({
      query: (data) => ({
        url: "/marketing/coupons",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.coupon],
    }),
    deleteCoupon: build.mutation({
      query: (id) => ({
        url: `/marketing/coupons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.coupon],
    }),
    // Promotions
    getPromotions: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/marketing/promotions",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.coupon], // Using coupon tag for now or should add promotion tag? Let's reuse or add generic marketing tag. reusing coupon for simplicity as they likely share 'marketing' scope or I should add tags.
    }),
    createPromotion: build.mutation({
      query: (data) => ({
        url: "/marketing/promotions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.coupon],
    }),
    deletePromotion: build.mutation({
      query: (id) => ({
        url: `/marketing/promotions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.coupon],
    }),
    // Campaigns
    getCampaigns: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/marketing/campaigns",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.coupon],
    }),
    createCampaign: build.mutation({
      query: (data) => ({
        url: "/marketing/campaigns",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.coupon],
    }),
    deleteCampaign: build.mutation({
      query: (id) => ({
        url: `/marketing/campaigns/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.coupon],
    }),
    // Audiences
    getAudiences: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/marketing/audiences",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.coupon],
    }),
    // Events
    getEvents: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/marketing/events",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.coupon],
    }),
    // Pixels
    getPixels: build.query({
      query: (arg: Record<string, any>) => ({
        url: "/marketing/pixels",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.coupon],
    }),
    createPixel: build.mutation({
      query: (data) => ({
        url: "/marketing/pixels",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.coupon],
    }),
    deletePixel: build.mutation({
      query: (id) => ({
        url: `/marketing/pixels/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.coupon],
    }),
    // SEO
    getSeoSettings: build.query({
      query: () => ({
        url: "/marketing/seo",
        method: "GET",
      }),
      providesTags: [tagTypes.coupon],
    }),
    updateSeoSettings: build.mutation({
      query: (data) => ({
        url: "/marketing/seo",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.coupon],
    }),
  }),
});

export const {
  useGetCouponsQuery,
  useCreateCouponMutation,
  useDeleteCouponMutation,
  useGetPromotionsQuery,
  useCreatePromotionMutation,
  useDeletePromotionMutation,
  useGetCampaignsQuery,
  useCreateCampaignMutation,
  useDeleteCampaignMutation,
  useGetAudiencesQuery,
  useGetEventsQuery,
  useGetPixelsQuery,
  useCreatePixelMutation,
  useDeletePixelMutation,
  useGetSeoSettingsQuery,
  useUpdateSeoSettingsMutation,
} = marketingApi;
