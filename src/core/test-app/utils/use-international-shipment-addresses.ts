import { CarrierApp } from "@shipengine/integration-platform-sdk";
import { buildAddressWithContactInfo } from "../factories/address";
import findInternationalDeliveryService from "./find-international-delivery-service";

/**
 * Returns a tuple of international shipment addresses [to, from]. Throws an error if addresses can not be resolved.
 * @param {object} defaultObject - The default object.
 * @param {object} configObject - The config object. Key/values in this object receive precedence.
 */
export default function useInternationalShipmentAddresses(app: CarrierApp) {
  let toCountryCode: string | undefined;
  let fromCountryCode: string | undefined;
  let deliveryService;

  try {
    deliveryService = findInternationalDeliveryService(app);
  } catch {
    throw new Error("this app does not support international shipping");
  }

  if (deliveryService.originCountries.length === 1) {
    fromCountryCode = deliveryService.originCountries[0];
    toCountryCode = deliveryService.destinationCountries.find(
      (destinationCountry) => destinationCountry !== fromCountryCode,
    );
    if (!toCountryCode)
      throw new Error(
        "useInternationalShipmentAddresses: can not resolve to country",
      );
  } else if (deliveryService.destinationCountries.length === 1) {
    toCountryCode = deliveryService.destinationCountries[0];
    fromCountryCode = deliveryService.destinationCountries.find(
      (destinationCountry) => destinationCountry !== toCountryCode,
    );
    if (!fromCountryCode)
      throw new Error(
        "useInternationalShipmentAddresses: can not resolve from country",
      );
  }
  //  else {

  // }

  return [
    buildAddressWithContactInfo(`${fromCountryCode}-from`),
    buildAddressWithContactInfo(`${toCountryCode}-to`),
  ];
}
