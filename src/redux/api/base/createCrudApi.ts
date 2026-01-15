import { baseApi } from "./baseApi";

export interface CrudApiConfig {
  resourceName: string;
  baseUrl: string;
  tagType: any;
  transformList?: (response: any) => any;
  transformItem?: (response: any) => any;

  endpoints?: {
    create?: boolean;
    getAll?: boolean;
    getOne?: boolean;
    update?: boolean;
    delete?: boolean;
  };
}

export const createCrudApi = (config: CrudApiConfig) => {
  const {
    resourceName,
    baseUrl,
    tagType,
    transformList = (response: any) =>
      response.data?.data?.result ||
      response.data?.data ||
      response.data?.result ||
      response.data ||
      [],
    transformItem = (response: any) => response.data?.data || response.data,
    endpoints = {},
  } = config;

  const enabledEndpoints = {
    create: true,
    getAll: true,
    getOne: true,
    update: true,
    delete: true,
    ...endpoints,
  };

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);
  const capitalizedName = capitalize(resourceName);

  const api = baseApi.injectEndpoints({
    endpoints: (build) => {
      const endpointConfig: any = {};

      // CREATE endpoint
      if (enabledEndpoints.create) {
        endpointConfig[`create${capitalizedName}`] = build.mutation({
          query: (data: any) => ({
            url: baseUrl,
            method: "POST",
            contentType: "application/json",
            data,
          }),
          transformResponse: transformItem,
          invalidatesTags: [tagType as any],
        });
      }

      // GET ALL endpoint
      if (enabledEndpoints.getAll) {
        endpointConfig[`get${capitalizedName}s`] = build.query({
          query: (params: any) => ({
            url: baseUrl,
            method: "GET",
            params,
          }),
          transformResponse: transformList,
          providesTags: [tagType as any],
        });
      }

      // GET ONE endpoint
      if (enabledEndpoints.getOne) {
        endpointConfig[`get${capitalizedName}`] = build.query({
          query: (id: any) => ({
            url: `${baseUrl}/${id}`,
            method: "GET",
          }),
          transformResponse: transformItem,
          providesTags: [tagType as any],
        });
      }

      // UPDATE endpoint
      if (enabledEndpoints.update) {
        endpointConfig[`update${capitalizedName}`] = build.mutation({
          query: (data: any) => ({
            url: `${baseUrl}/${data.id}`,
            method: "PATCH",
            contentType: "application/json",
            data: data.body,
          }),
          transformResponse: transformItem,
          invalidatesTags: [tagType as any],
        });
      }

      // DELETE endpoint
      if (enabledEndpoints.delete) {
        endpointConfig[`delete${capitalizedName}`] = build.mutation({
          query: (id: any) => ({
            url: `${baseUrl}/${id}`,
            method: "DELETE",
          }),
          transformResponse: transformItem,
          invalidatesTags: [tagType as any],
        });
      }

      return endpointConfig;
    },
  });

  // Generate hooks object
  const hooks: any = {};

  if (enabledEndpoints.create) {
    hooks[`useCreate${capitalizedName}Mutation`] = (api as any)[
      `useCreate${capitalizedName}Mutation`
    ];
  }

  if (enabledEndpoints.getAll) {
    hooks[`useGet${capitalizedName}sQuery`] = (api as any)[
      `useGet${capitalizedName}sQuery`
    ];
  }

  if (enabledEndpoints.getOne) {
    hooks[`useGet${capitalizedName}Query`] = (api as any)[
      `useGet${capitalizedName}Query`
    ];
  }

  if (enabledEndpoints.update) {
    hooks[`useUpdate${capitalizedName}Mutation`] = (api as any)[
      `useUpdate${capitalizedName}Mutation`
    ];
  }

  if (enabledEndpoints.delete) {
    hooks[`useDelete${capitalizedName}Mutation`] = (api as any)[
      `useDelete${capitalizedName}Mutation`
    ];
  }

  return { api, hooks };
};
