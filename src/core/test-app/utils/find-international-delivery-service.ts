import {
  DeliveryService,
  CarrierApp,
} from "@shipengine/integration-platform-sdk";

export default function findInternationalDeliveryService(
  app: CarrierApp,
): DeliveryService | undefined {
  for (let deliveryService of app.deliveryServices) {
    if (
      deliveryService.serviceArea === "international" ||
      deliveryService.serviceArea === "global" ||
      // If there is more than 1 origin country this is international
      deliveryService.originCountries.length > 1 ||
      // If there is more than 1 destination country this is international
      deliveryService.destinationCountries.length > 1 ||
      // If there is only 1 origin & destination country but they are different this is international
      deliveryService.originCountries[0] !==
        deliveryService.destinationCountries[0]
    ) {
      return deliveryService;
    }
  }
}
