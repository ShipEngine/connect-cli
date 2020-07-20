import {
  DeliveryService,
  CarrierApp,
} from "@shipengine/integration-platform-sdk";

export default function findDeliveryServiceByName(
  name: string,
  app: CarrierApp,
): DeliveryService {
  const deliveryService = app.deliveryServices.find(
    (deliveryService) => deliveryService.name === name,
  );
  if (!deliveryService)
    throw new Error(
      `shipengine.config.js deliveryServiceName: '${name}' does not exist`,
    );

  return deliveryService;
}
