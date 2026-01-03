import { tagTypes } from "../../../tag-types";
import { createCrudApi } from "../../base/createCrudApi";

// Assuming a generic logistics tag or specific driver tag. Using generic 'logistics' if customized, but default createCrudApi supports dynamic tags if registered. 
// Adding 'driver' to tagTypes might be needed if not present. Using 'other' for now or extending tagTypes.
// Checking tagTypes.ts content earlier showed 'courier', 'expense'. Need to ensure 'driver'/'vehicle' tags exist or reuse.

const { api: driverApi, hooks } = createCrudApi({
  resourceName: 'driver',
  baseUrl: '/super-admin/logistics/drivers', // Verifying route: logisticsRoutes usually has /drivers
  tagType: 'Driver' as any, // Temporary cast until added to tag types
});

export const {
  useGetDriversQuery,
  useGetDriverQuery,
  useCreateDriverMutation,
  useUpdateDriverMutation,
  useDeleteDriverMutation,
} = hooks;

export default driverApi;
