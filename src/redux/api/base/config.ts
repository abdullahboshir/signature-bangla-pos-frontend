
export const baseURL: string =
  process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_BACKEND_BASE_API_URL || "http://localhost:5000/api/v1"
    : process.env.NEXT_PUBLIC_API_BASE_URL_LIVE || "http://localhost:5000/api/v1";
