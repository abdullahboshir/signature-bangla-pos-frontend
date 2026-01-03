import { tagTypes } from "../../tag-types";
import { createCrudApi } from "../base/createCrudApi";


const { api: expenseCategoryApi, hooks } = createCrudApi({
  resourceName: 'expense-categories',
  baseUrl: '/super-admin/expense-categories',
  tagType: tagTypes.expenseCategory,
});

export const {
  useGetExpenseCategoriesQuery,
  useGetExpenseCategoryQuery,
  useCreateExpenseCategoryMutation,
  useUpdateExpenseCategoryMutation,
  useDeleteExpenseCategoryMutation,
  useRestoreExpenseCategoryMutation,
} = hooks;

export default expenseCategoryApi;
