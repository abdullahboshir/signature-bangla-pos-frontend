import { authKey } from "@/constant/authKey";

export const setToLocalStorage = (token: string) => {
  if (!authKey || typeof window === "undefined") {
    return "";
  }
  return localStorage.setItem(authKey, token);
};

export const getFromLocalStorage = () => {
  if (!authKey || typeof window === "undefined") {
    return "";
  }
  return localStorage.getItem(authKey);
};

export const removeFromLocalStorage = () => {
  if (!authKey || typeof window === "undefined") {
    return "";
  }
  return localStorage.removeItem(authKey);
};
