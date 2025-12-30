
import { baseApi } from "../base/baseApi";

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    uploadFile: build.mutation({
      query: (formData: FormData) => ({
        url: "/super-admin/upload/image",
        method: "POST",
        data: formData,
      }),
      transformResponse: (response: any) => response.data?.url || response.data,
    }),
  }),
});

export const { useUploadFileMutation } = uploadApi;

