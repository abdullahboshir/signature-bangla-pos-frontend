import { USER_ROLES } from "@/config/auth-constants";
import { LucideIcon } from "lucide-react";

export type TMeta = {
  page: number;
  limit: number;
  total: number;
};

export type TUserRole = keyof typeof USER_ROLES;


export interface DrawerItem {
  title: string;
  path?: string;
  icon?: LucideIcon;
  children?: DrawerItem[];
}


export type TResponseSuccess<T = unknown> = {
  data: T;
  meta?: TMeta;
};

export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: TGenericErrorMessage[];
};

export type TGenericErrorMessage = {
  path: string | number;
  message: string;
};
