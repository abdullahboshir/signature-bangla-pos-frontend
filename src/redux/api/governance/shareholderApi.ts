import { tagTypes } from "../../tag-types";
import { createCrudApi } from "../base/createCrudApi";

const { api: shareholderApi, hooks } = createCrudApi({
  resourceName: "shareholder",
  baseUrl: "/governance/shareholders",
  tagType: tagTypes.shareholder,
});

export const {
  useCreateShareholderMutation,
  useGetShareholdersQuery,
  useGetShareholderQuery,
  useUpdateShareholderMutation,
  useDeleteShareholderMutation,
} = hooks;

export default shareholderApi;
