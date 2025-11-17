/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { authKey } from '@/constant/authKey';
import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';

import { redirect } from 'next/navigation';

export const setAccessTokenToCookies = async (token: string, option?: any) => {
   const cookiesStore = await cookies();
   cookiesStore.set(authKey, token);
   const accessToken = cookiesStore.get(authKey)?.value;
   const decode = jwtDecode(accessToken!) as any;

   if (option && option.passwordChangeRequired) {
      redirect(`/${decode?.role}/change-password`);
   }
   if (option && !option.passwordChangeRequired && option.redirect) {
      redirect(option.redirect);
   }
};




export const deleteCookies = async (keys: string[]) => {
    const cookiesStore = await cookies();
   keys.forEach((key) => {
      cookiesStore.delete(key);
   });
};

