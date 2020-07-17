import {
  DateTimeZonePOJO,
  WeightUnit,
  DocumentFormat,
  DocumentSize,
  AddressWithContactInfoPOJO,
  TimeRangePOJO,
  AddressPOJO,
  ContactInfoPOJO,
  PickupShipmentPOJO,
} from "@shipengine/integration-platform-sdk";

export interface TestOptions {
  debug?: boolean;
  expectedErrorMessage?: string;
  retries?: number;
  skip?: boolean;
  timeout?: number;
}

export interface CreateShipmentDomesticOptions extends TestOptions {
  deliveryServiceName: string;
  labelFormat: DocumentFormat;
  labelSize: DocumentSize;
  shipFrom: AddressWithContactInfoPOJO;
  shipTo: AddressWithContactInfoPOJO;
  weight: {
    value: number;
    unit: WeightUnit;
  };
  shipDateTime: DateTimeZonePOJO | Date | string;
  packagingName: string;
  deliveryConfirmationName?: string;
}

export interface RateShipmentOptions extends TestOptions {
  deliveryServiceNames: string | string[];
  shipFrom: AddressWithContactInfoPOJO;
  shipTo: AddressWithContactInfoPOJO;
  weight: {
    value: number;
    unit: WeightUnit;
  };
  shipDateTime: DateTimeZonePOJO | Date | string;
  packagingName: string;
}

export interface SchedulePickupOptions extends TestOptions {
  pickupServiceName: string;
  timeWindow: TimeRangePOJO;
  address: AddressPOJO;
  contact: ContactInfoPOJO;
  notes: string[] | string;
  shipments: PickupShipmentPOJO[] | PickupShipmentPOJO;
}

export interface TestsConfig {
  cancelPickups?: (TestOptions & TestOptions) | [TestOptions];
  cancelShipments?: TestOptions | [TestOptions];
  createManifest?: TestOptions | [TestOptions];
  createShipment_domestic?: CreateShipmentDomesticOptions | [CreateShipmentDomesticOptions];
  createShipment_international?: TestOptions | [TestOptions];
  createShipment_multi_package?: TestOptions | [TestOptions];
  rateShipment?: RateShipmentOptions | [RateShipmentOptions];
  schedulePickup?: SchedulePickupOptions | [SchedulePickupOptions];
  trackShipment?: TestOptions | [TestOptions];
}

export default interface Config {
  connect_credentials?: object;
  concurrency?: number;
  debug?: boolean;
  failFast?: boolean;
  retries?: number;
  timeout?: number;
  tests?: TestsConfig;
}
