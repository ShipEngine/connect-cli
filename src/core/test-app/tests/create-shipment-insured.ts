import {
  CarrierApp,
  DeliveryService,
  NewShipmentPOJO,
  NewPackagePOJO,
  WeightUnit,
  DeliveryConfirmation,
  Currency
} from "@shipengine/integration-platform-sdk";
import Suite from "../runner/suite";
import {
  CreateShipmentInsuranceConfigOptions,
  CreateShipmentInsuranceTestParams,
} from "../runner/config/create-shipment-insurance";
import { initializeTimeStamps } from "../../utils/time-stamps";
import reduceDefaultsWithConfig from '../utils/reduce-defaults-with-config';
import objectToTestTitle from '../utils/object-to-test-title';
import useDomesticShippingAddress from '../utils/use-domestic-shipment-addresses';

import { expect } from "chai";
import findDeliveryServiceByName from '../utils/find-delivery-service-by-name';
import findDeliveryConfirmationByName from '../utils/find-delivery-confirmation-by-name';
import { findInsurableDeliveryService } from '../utils/find-insurable-delivery-service';
import findPackagingByName from '../utils/find-packaging-by-name';

interface TestArgs {
  title: string;
  methodArgs: NewShipmentPOJO;
  config: any;
  testParams: CreateShipmentInsuranceTestParams;
}

export class CreateShipmentInsured extends Suite {
  title = "createShipment_insured";

  private deliveryService?: DeliveryService;
  private deliveryConfirmation?: DeliveryConfirmation;

  private setDeliveryService(
    config: CreateShipmentInsuranceConfigOptions,
  ): void {
    const carrierApp = this.app as CarrierApp;

    if (config.deliveryServiceName) {
      this.deliveryService = findDeliveryServiceByName(
        config.deliveryServiceName,
        carrierApp,
      );
      if(!this.deliveryService.isInsurable) {
        throw new Error(`The configured delivery service '${this.deliveryService.name}' does not support insuring packages`);
      }
    } else {
      try {
        this.deliveryService = findInsurableDeliveryService(carrierApp);
      } catch {
        this.deliveryService = undefined;
      }
    }
  }

  private setDeliveryConfirmation(
    config: CreateShipmentInsuranceConfigOptions,
  ): void {
    if (config.deliveryConfirmationName) {
      // We do not want to handle the exception here if this raises. It indicates issues w/ the config provided.
      this.deliveryConfirmation = findDeliveryConfirmationByName(
        config.deliveryConfirmationName,
        this.app as CarrierApp,
      );
    } else if (
      this.deliveryService &&
      this.deliveryService.deliveryConfirmations.length !== 0 &&
      this.deliveryService.deliveryConfirmations[0]
    ) {
      this.deliveryConfirmation = this.deliveryService.deliveryConfirmations[0];
    } else {
      this.deliveryConfirmation = undefined;
    }
  }

  buildTestArg(
    config: CreateShipmentInsuranceConfigOptions,
  ): TestArgs | undefined {
    let carrierApp = this.app as CarrierApp;
    this.setDeliveryService(config);
    this.setDeliveryConfirmation(config);

    if (!this.deliveryService) return undefined;

    let [shipFrom, shipTo] = useDomesticShippingAddress(this.deliveryService);

    if (!shipFrom || !shipTo) return undefined;

    const { tomorrow } = initializeTimeStamps(shipFrom!.timeZone);

    // Make a best guess at the defaults, need to resolve the default vs config based delivery service early
    // on since that determines what address and associated timezones get generated.
    const defaults: CreateShipmentInsuranceTestParams = {
      deliveryServiceName: this.deliveryService.name,
      shipDateTime: tomorrow,
      shipFrom: shipFrom!,
      shipTo: shipTo!,
      weight: {
        unit: WeightUnit.Pounds,
        value: 50.0,
      },
      packagingName: this.deliveryService.packaging[0].name,
      packageInsuredValue: {
        value: "10",
        currency: Currency.UnitedStatesDollar
      }
    };

    if (this.deliveryService.deliveryConfirmations.length > 0) {
      defaults.deliveryConfirmationName = this.deliveryService.deliveryConfirmations[0].name;
    }

    const testParams = reduceDefaultsWithConfig<
      CreateShipmentInsuranceTestParams
    >(defaults, config);

    const packagePOJO: NewPackagePOJO = {
      packaging: {
        id: findPackagingByName(testParams.packagingName, carrierApp).id
      },
      label: {
        size: this.deliveryService.labelSizes[0],
        format: this.deliveryService.labelFormats[0],
      },
      weight: {
        value: testParams.weight.value,
        unit: testParams.weight.unit,
      },
      insuredValue: testParams.packageInsuredValue
    };

    if (this.deliveryConfirmation) {
      packagePOJO.deliveryConfirmation = {
        id: this.deliveryConfirmation.id,
      };
    }

    if (this.deliveryService.deliveryConfirmations.length > 0) {
      packagePOJO.deliveryConfirmation = {
        id: this.deliveryService.deliveryConfirmations[0].id,
      };
    }

    if (testParams.deliveryConfirmationName) {
      packagePOJO.deliveryConfirmation = {
        id: this.deliveryService.deliveryConfirmations.find(
          (dc) => dc.name === testParams.deliveryConfirmationName,
        )!.id,
      };
    }

    let newShipmentPOJO: NewShipmentPOJO = {
      deliveryService: {
        id: this.deliveryService.id,
      },
      shipFrom: testParams.shipFrom!,
      shipTo: testParams.shipTo!,
      shipDateTime: testParams.shipDateTime,
      packages: [packagePOJO],
    };

    const title = config.expectedErrorMessage
      ? `it raises an error when creating a new insured shipment with ${objectToTestTitle(
        testParams,
      )}`
      : `it creates a new insured shipment with ${objectToTestTitle(
        testParams,
      )}`;

    return {
      title,
      methodArgs: newShipmentPOJO,
      config,
      testParams
    };
  }

  buildTestArgs(): Array<TestArgs | undefined> {
    if (Array.isArray(this.config)) {
      return this.config.map((config: CreateShipmentInsuranceConfigOptions) => {
        return this.buildTestArg(config);
      });
    } else {
      const config = this.config as CreateShipmentInsuranceConfigOptions;

      return [this.buildTestArg(config)];
    }
  }

  tests() {
    const testArgs = this.buildTestArgs().filter((args) => args !== undefined);

    if (testArgs.length === 0) {
      return [];
    }
    return testArgs.map((testArg) => {
      return this.test(
        testArg!.title,
        testArg!.methodArgs,
        testArg!.config,
        async () => {
          const carrierApp = this.app as CarrierApp;

          const transaction = await this.transaction(testArg!.config);

          if (!carrierApp.createShipment) {
            throw new Error("createShipment is not implemented");
          }

          const shipmentConfirmation = await carrierApp.createShipment(transaction, testArg!.methodArgs);

          // If DeliveryServiceDefinition.fulfillmentService is set, then the shipment’s fulfillmentService must match it
          if (this.deliveryService?.fulfillmentService) {
            expect(shipmentConfirmation.fulfillmentService).to.equal(
              this.deliveryService?.fulfillmentService,
              "The shipmentConfirmation.fulfillmentService returned from createShipment does not equal the given deliveryService.fulfillmentService",
            );
          }

          // If DeliveryServiceDefinition.isTrackable is true, then the shipment must have a trackingNumber set
          if (this.deliveryService?.isTrackable) {
            const customMsg = "The shipmentConfirmation.isTrackable returned from createShipment must be present when the given deliveryService.isTrackable is set to 'true'";
            expect(shipmentConfirmation.trackingNumber, customMsg).to.be.ok;
          }

          const customMsg = "The shipment confirmation packages array should have the same number of packages that were on the request";
          expect(shipmentConfirmation.packages.length).to.equal(testArg!.methodArgs.packages.length, customMsg);
        }
      );
    });
  }
}

// /**
//  * Currently, just return the first valid domestic delivery service that we have an address for
//  */
// function pickDomesticDeliveryService(
//   deliveryServices: DomesticDeliveryService,
// ): DeliveryService | undefined {
//   for (let ds of deliveryServices) {
//     for (let domesticCountry of ds.domesticCountries) {
//       if (buildAddress(`${domesticCountry}-from`)) {
//         return ds.deliveryService;
//       }
//     }
//   }

//   return undefined;
// }
