// import {
//   DeliveryService,
//   CarrierApp,
// } from "@shipengine/integration-platform-sdk";

// export default function findDeliveryServiceByName(
//   name: string,
//   app: CarrierApp,
// ): DeliveryService {
//   const deliveryService = app.deliveryServices.find(
//     (deliveryService) => deliveryService.name === name,
//   );

//   for (let deliveryService of carrierApp.deliveryServices) {
//     if (
//       // If there is more than 1 origin country this is international
//       deliveryService.originCountries.length > 1 ||
//       // If there is more than 1 destination country this is international
//       deliveryService.destinationCountries.length > 1 ||
//       // If there is only 1 origin & destination country but they are different this is international
//       deliveryService.originCountries[0] !==
//         deliveryService.destinationCountries[0]
//     ) {
//       this.deliveryService = deliveryService;
//       return;
//     }
//   }

//   return deliveryService;
// }
