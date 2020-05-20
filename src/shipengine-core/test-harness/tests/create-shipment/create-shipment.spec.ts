import { generateAddress } from "../../utils/address";

import { v4 } from "uuid";

import { generateCarrierTests, CarrierTest } from "../../utils/generate-tests";
import { CarrierApp, NewShipmentPOJO, NewPackagePOJO, WeightUnit, TransactionPOJO } from '@shipengine/integration-platform-sdk';

let tests;


export function test(app: CarrierApp) {

  let description = "The create Shipment method";

  tests = generateTestData(app);
  generateCarrierTests(tests, "createShipment", app, description);
};

function generateTestData(app: CarrierApp): CarrierTest[] {

  let generatedTests: CarrierTest[] = [];

  let testCounter = 0;
  for (let deliveryService of app.carrier.deliveryServices) {
    // TODO: randomize weight values
    // TODO: Add support for calling from different countries
    // TODO: Test different date time 
    for (let labelFormat of deliveryService.labelFormats) {

      for (let labelSize of deliveryService.labelSizes) {

        for (let deliveryConfirmation of deliveryService.deliveryConfirmations) {

          let transactionPOJO: TransactionPOJO = {
            id: v4(),
            isRetry: false,
            useSandbox: false,
            session: {
              id: v4()
            }
          };

          const packagePOJO: NewPackagePOJO = {
            deliveryConfirmation: { id: deliveryConfirmation.id },
            packaging: { id: deliveryService.packaging[0].id },
            label: {
              size: labelSize,
              format: labelFormat
            },
            weight: {
              value: 1.0,
              unit: WeightUnit.Grams
            }
          };

          let newShipmentPOJO: NewShipmentPOJO = {
            deliveryService: { id: deliveryService.id },
            shipFrom: generateAddress("US"),
            shipTo: generateAddress("US"),
            // returnTo: undefined,
            shipDateTime: new Date(),
            // insuranceProvider: undefined,
            // returns?: "",
            // billing: undefined,
            packages: [packagePOJO]
          };

          // newShipmentPOJO.packages = [];
          // newShipmentPOJO.packages.push(packagePOJO);

          let debugString;
          if (process.env["TEST_DEBUG"]) {
            debugString = JSON.stringify(newShipmentPOJO, undefined, 2);
          }

          testCounter = testCounter + 1;
          let message: string[] = [
            `Create Shipment (${testCounter}): should return a valid shipment for the following request:`,
            ``,
            `Delivery Service: ${deliveryService.name}`,
            `Label Format: ${labelFormat}`,
            `Label Size: ${labelSize}`,
            `Delivery Confirmation: ${deliveryConfirmation.name}`,
            `${debugString ? debugString : ""}`
          ];

          generatedTests.push([transactionPOJO, newShipmentPOJO, message]);
          //   for (let originCountry of deliveryService.originCountries) {
          //     for (let destinationCountry of deliveryService.destinationCountries) {
          //       for (let package of deliveryService.packaging) {
          //       }
          //     }
          //   }
        }

      }
    }

  }

  return generatedTests;
}