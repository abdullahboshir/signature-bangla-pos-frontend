// Redux API for Attribute Group Management
import { baseApi } from './base/baseApi';
import { tagTypes } from '../tag-types';

export const attributeGroupApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createAttributeGroup: build.mutation({
      query: (data) => ({
        url: '/super-admin/attribute-groups',
        method: 'POST',
        data,
      }),
      invalidatesTags: [tagTypes.attributeGroup],
    }),
    getAllAttributeGroups: build.query({
      query: () => ({
        url: '/super-admin/attribute-groups',
        method: 'GET',
      }),
      providesTags: [tagTypes.attributeGroup],
    }),
    getAttributeGroupById: build.query({
      query: (id) => ({
        url: `/super-admin/attribute-groups/${id}`,
        method: 'GET',
      }),
      providesTags: [tagTypes.attributeGroup],
    }),
    updateAttributeGroup: build.mutation({
      query: ({ id, data }) => ({
        url: `/super-admin/attribute-groups/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: [tagTypes.attributeGroup],
    }),
    deleteAttributeGroup: build.mutation({
      query: (id) => ({
        url: `/super-admin/attribute-groups/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.attributeGroup],
    }),
  }),
});

export const {
  useCreateAttributeGroupMutation,
  useGetAllAttributeGroupsQuery,
  useGetAttributeGroupByIdQuery,
  useUpdateAttributeGroupMutation,
  useDeleteAttributeGroupMutation,
} = attributeGroupApi;
