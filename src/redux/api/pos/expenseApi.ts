import { tagTypes } from "../../tag-types";
import { createCrudApi } from "../base/createCrudApi";

const { api: expenseApi, hooks } = createCrudApi({
  resourceName: 'expense',
  baseUrl: '/super-admin/expenses',
  tagType: tagTypes.expense,
});

export const {
  useGetExpensesQuery,
  useGetExpenseQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useRestoreExpenseMutation,
} = hooks;

export default expenseApi;
