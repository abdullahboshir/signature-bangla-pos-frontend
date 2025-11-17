import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import axios from 'axios'
import type { AxiosRequestConfig, AxiosError } from 'axios'

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
      const result = await axios({
        url: baseUrl + url,
        method: method || 'GET',
        data,
        params,
        headers: {
          "Content-Type": contentType || 'application/json',
          ...headers,
        },
      })
      return { data: result.data }
    } catch (axiosError) {
      const err = axiosError as AxiosError
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      }
    }
  }

