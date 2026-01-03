import { tagTypes } from "../../../tag-types";
import { createCrudApi } from "../../base/createCrudApi";

const { api: vehicleApi, hooks } = createCrudApi({
  resourceName: 'vehicle',
  baseUrl: '/super-admin/logistics/vehicles',
  tagType: 'Vehicle' as any,
});

export const {
  useGetVehiclesQuery,
  useGetVehicleQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
} = hooks;

export default vehicleApi;
