import { tagTypes } from "../../tag-types";
import { createCrudApi } from "../base/createCrudApi";

const { api: meetingApi, hooks } = createCrudApi({
  resourceName: "meeting",
  baseUrl: "/governance/meetings",
  tagType: tagTypes.meeting,
});

export const {
  useCreateMeetingMutation,
  useGetMeetingsQuery,
  useGetMeetingQuery,
  useUpdateMeetingMutation,
  useDeleteMeetingMutation,
} = hooks;

export default meetingApi;
