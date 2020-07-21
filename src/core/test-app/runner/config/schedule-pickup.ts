import {
  DateTimeZonePOJO,
  WeightPOJO,
  TimeRangePOJO,
  AddressPOJO,
  ContactInfoPOJO,
  Address,
} from "@shipengine/integration-platform-sdk";
import { BaseTestConfigOptions } from "./base-test-config-options";

export type PickupPackageConfig = {
  packagingName: string;
  dimensions?: DimensionsPOJO;
  weight?: WeightPOJO;
  metadata?: object;
};

export type PickupShipmentConfig = {
  deliveryServiceName: string;
  metadata?: object;
  packages: PickupPackageConfig | PickupPackageConfig[];
};

export interface SchedulePickupOptions extends BaseTestConfigOptions {
  pickupServiceName: string;
  timeWindow: TimeRangePOJO;
  address: AddressPOJO;
  contact: ContactInfoPOJO;
  notes: string[] | string;
  shipments: PickupShipmentConfig[] | PickupShipmentConfig;
  shipFrom?: Address;
  shipTo?: Address;
  weight?: WeightPOJO;
  shipDateTime?: DateTimeZonePOJO | Date | string;
  deliveryServiceName?: string;
}
