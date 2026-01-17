// Need to use the React-specific entry point to allow generating React hooks
import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '@/lib/axios/axiosBaseQuery'
import { tagTypesList } from '@/redux/tag-types';


import { baseURL } from './config';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery({ baseUrl: baseURL }),
  endpoints: () => ({ }),
  tagTypes: tagTypesList
})
