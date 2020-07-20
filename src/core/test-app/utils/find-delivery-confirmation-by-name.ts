import {
  DeliveryConfirmation,
  CarrierApp,
} from "@shipengine/integration-platform-sdk";

export default function findDeliveryConfirmationByName(
  name: string,
  app: CarrierApp,
): DeliveryConfirmation {
  const deliveryConfirmation = app.deliveryConfirmations.find(
    (deliveryConfirmation) => deliveryConfirmation.name === name,
  );
  if (!deliveryConfirmation)
    throw new Error(
      `shipengine.config.js deliveryConfirmationName: '${name}' does not exist`,
    );

  return deliveryConfirmation;
}
