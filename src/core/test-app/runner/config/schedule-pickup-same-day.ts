import {
  TimeRangePOJO,
  ContactInfoPOJO,
  AddressPOJO,
  WeightPOJO,
  DimensionsPOJO,
} from "@shipengine/connect-sdk";
import { BaseTestConfigOptions } from "./base-test-config-options";


export type PickupPackageConfig = {
  packagingName: string;
  dimensions?: DimensionsPOJO;
  weight?: WeightPOJO;
};

export type PickupShipmentConfig = {
  deliveryServiceName: string;
  packages: PickupPackageConfig[];
};

export interface SchedulePickupSameDayTestParams {
  pickupServiceName: string;
  deliveryServiceName: string;
  address: AddressPOJO;
  contact: ContactInfoPOJO;
  timeWindow: TimeRangePOJO;
  shipments: PickupShipmentConfig[];
}

export interface SchedulePickupSameDayConfigOptions
  extends SchedulePickupSameDayTestParams,
    BaseTestConfigOptions {}