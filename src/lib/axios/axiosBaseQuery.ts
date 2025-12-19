import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import type { AxiosRequestConfig, AxiosError } from 'axios'
import { axiosInstance } from '@/lib/axios/axiosInstance'

export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' },
  ): BaseQueryFn<
    {
      url: string
      method?: AxiosRequestConfig['method']
      data?: AxiosRequestConfig['data']
      params?: AxiosRequestConfig['params']
      headers?: AxiosRequestConfig['headers']
      meta?: unknown
      contentType?: string
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, contentType, headers }) => {
    try {
      const result = await axiosInstance({
        url: url,
        method: method || 'GET',
        data,
        params,
        headers: {
          "Content-Type": contentType || (data instanceof FormData ? undefined : 'application/json'),
          ...headers,
        },
      })
      return { data: result }
    } catch (axiosError) {
      const err = axiosError as any
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      }
    }
  }

