export const VEHICLE_TYPE = {
  TRUCK: 'truck',
  VAN: 'van',
  BIKE: 'bike',
  SCOOTER: 'scooter',
} as const;

export const VEHICLE_TYPE_OPTIONS = [
  { value: VEHICLE_TYPE.TRUCK, label: 'Truck' },
  { value: VEHICLE_TYPE.VAN, label: 'Van' },
  { value: VEHICLE_TYPE.BIKE, label: 'Bike' },
  { value: VEHICLE_TYPE.SCOOTER, label: 'Scooter' },
];

export const VEHICLE_STATUS = {
  ACTIVE: 'active',
  MAINTENANCE: 'maintenance',
  BUSY: 'busy',
} as const;

export const VEHICLE_STATUS_OPTIONS = [
  { value: VEHICLE_STATUS.ACTIVE, label: 'Active' },
  { value: VEHICLE_STATUS.MAINTENANCE, label: 'Maintenance' },
  { value: VEHICLE_STATUS.BUSY, label: 'Busy' },
];

export const COURIER_PROVIDER = {
  STEADFAST: 'steadfast',
  PATHAO: 'pathao',
  REDX: 'redx',
  PAPERFLY: 'paperfly',
  ECOURIER: 'ecourier',
} as const;

export const COURIER_PROVIDER_OPTIONS = [
  { value: COURIER_PROVIDER.STEADFAST, label: 'Steadfast' },
  { value: COURIER_PROVIDER.PATHAO, label: 'Pathao' },
  { value: COURIER_PROVIDER.REDX, label: 'RedX' },
  { value: COURIER_PROVIDER.PAPERFLY, label: 'Paperfly' },
  { value: COURIER_PROVIDER.ECOURIER, label: 'eCourier' },
];
