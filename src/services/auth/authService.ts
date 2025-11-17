/* eslint-disable @typescript-eslint/no-explicit-any */

import { authKey } from '@/constant/authKey';
import { instance as axiosInstance } from '@/lib/axios/axiosInstance';
import { baseURL } from '@/redux/api/base/baseApi';
import { deleteCookies, setAccessTokenToCookies } from '@/utils/cookies';
import { getFromLocalStorage, removeFromLocalStorage, setToLocalStorage } from '@/utils/localStorage';
import { jwtDecode } from 'jwt-decode';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { FieldValues } from 'react-hook-form';



export const Login = async (formData: FieldValues) => {
  try {
  
 let res: Response;
 
    try {
   res = await fetch(
    `${baseURL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      // cache: "no-store",
      credentials: "include",
    }
  );
   } catch (fetchError: any) {
      throw new Error(`Network error. ${fetchError.message || " Server may be down or unreachable."}`);
    }
 
  const user = await res.json();
  const accessToken = user?.data?.accessToken;




   if (accessToken) {
  const passwordChangeRequired = user?.data?.needsPasswordChange;
     const decoded = jwtDecode(accessToken!) as any;

           const redirection =
        decoded?.role === 'customer'
          ? `/`
          : '/dashboard';

      setAccessTokenToCookies(accessToken, {
         redirect: redirection,
        //  passwordChangeRequired,
      });

      setToLocalStorage(accessToken)
   }


  return user;

    } catch (error: any) {
      console.error("Login error:", error);

      return{
        success: false,
        message: error?.message || "Login failed. Please try again.",
        data: null
      }
      
    }
};




export const logout = (router: AppRouterInstance) => {
   removeFromLocalStorage();
   deleteCookies([authKey, 'refreshToken']);
   router.push('/login');
   router.refresh();
};



export const isLoggedIn = () => {
    const token = getFromLocalStorage();
    if(token) return !!token
}



export const getNewAccessToken = async () => {
  return await axiosInstance({
    url: `${baseURL}/auth/refresh-token`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
};
