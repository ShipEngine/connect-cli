import { DeliveryService, WeightUnit, DeliveryConfirmation, LengthUnit } from "@shipengine/connect-sdk";
import { CarrierApp, NewShipmentPOJO, NewPackagePOJO } from "@shipengine/connect-sdk/lib/internal";
import Suite from "../runner/suite";
import {
  CreateShipmentReturnConfigOptions,
  CreateShipmentReturnTestParams,
} from "../runner/config/create-shipment-return";
import { initializeTimeStamps } from "../../utils/time-stamps";
import reduceDefaultsWithConfig from "../utils/reduce-defaults-with-config";
import objectToTestTitle from "../utils/object-to-test-title";
import useDomesticShippingAddress from "../utils/use-domestic-shipment-addresses";

import { expect } from "chai";
import findDeliveryServiceByName from "../utils/find-delivery-service-by-name";
import findDeliveryConfirmationByName from "../utils/find-delivery-confirmation-by-name";
import Test from '../runner/test';

interface TestArgs {
  title: string;
  methodArgs: NewShipmentPOJO;
  config: unknown;
}

export class CreateShipmentReturn extends Suite {
  title = "createShipment_return";

  private deliveryService?: DeliveryService;

  private deliveryConfirmation?: DeliveryConfirmation;

  private setDeliveryService(
    config: CreateShipmentReturnConfigOptions,
  ): void {
    const carrierApp = this.app as CarrierApp;

    if (config.deliveryServiceName) {
      this.deliveryService = findDeliveryServiceByName(
        config.deliveryServiceName,
        carrierApp,
      );

      if (!this.deliveryService.supportsReturns) {
        throw new Error(`Configured delivery service "${config.deliveryServiceName}" does not support return shipments`);
      }
    } else {
      this.deliveryService = undefined;

      for (const ds of carrierApp.deliveryServices) {
        if (ds.supportsReturns) {
          this.deliveryService = ds;
        }
      }
    }
  }

  private setDeliveryConfirmation(
    config: CreateShipmentReturnConfigOptions,
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
    config: CreateShipmentReturnConfigOptions,
  ): TestArgs | undefined {
    this.setDeliveryService(config);
    this.setDeliveryConfirmation(config);

    if (!this.deliveryService) return undefined;

    let shipFrom;
    let returnTo;
    try {
      [shipFrom, returnTo] = useDomesticShippingAddress(this.deliveryService);
    } catch {
      return undefined;
    }

    const { tomorrow } = initializeTimeStamps();

    // Make a best guess at the defaults, need to resolve the default vs config based delivery service early
    // on since that determines what address and associated timezones get generated.
    const defaults: CreateShipmentReturnTestParams = {
      deliveryServiceName: this.deliveryService.name,
      label: {
        size: this.deliveryService.labelSizes[0],
        format: this.deliveryService.labelFormats[0]
      },
      shipDateTime: tomorrow,
      shipFrom: shipFrom,
      returnTo: returnTo,
      weight: {
        unit: WeightUnit.Pounds,
        value: 50.0,
      },
      dimensions: {
        length: 12,
        width: 12,
        height: 12,
        unit: LengthUnit.Inches
      },
      rmaNumber: `RMA-${Buffer.from(new Date().toISOString()).toString("base64").toUpperCase()}`
    };

    if (this.deliveryService.deliveryConfirmations.length > 0) {
      defaults.deliveryConfirmationName = this.deliveryService.deliveryConfirmations[0].name;
    }

    const testParams = reduceDefaultsWithConfig<
      CreateShipmentReturnTestParams
    >(defaults, config);

    if (!testParams.shipFrom || !testParams.returnTo) return undefined;

    const packagePOJO: NewPackagePOJO = {
      packaging: {
        id: this.deliveryService.packaging[0].id
      },
      label: {
        size: testParams.label.size,
        format: testParams.label.format,
      },
      weight: {
        value: testParams.weight.value,
        unit: testParams.weight.unit,
      },
      dimensions: {
        length: testParams.dimensions.length,
        width: testParams.dimensions.width,
        height: testParams.dimensions.height,
        unit: testParams.dimensions.unit
      }
    };

    const newShipmentPOJO: NewShipmentPOJO = {
      deliveryService: {
        id: this.deliveryService.id,
      },
      shipFrom: testParams.shipFrom,
      shipTo: testParams.returnTo,
      shipDateTime: testParams.shipDateTime,
      packages: [packagePOJO],
      returns: {
        isReturn: true,
        rmaNumber: testParams.rmaNumber
      }
    };

    const title = config.expectedErrorMessage
      ? `it raises an error when creating a new return shipment with ${objectToTestTitle(
        testParams,
      )}`
      : `it creates a new return shipment with ${objectToTestTitle(
        testParams,
      )}`;

    if (this.deliveryConfirmation) {
      newShipmentPOJO.deliveryConfirmation = {
        id: this.deliveryConfirmation.id,
      };
    }

    if (testParams.deliveryConfirmationName) {
      const deliveryConfirmation = this.deliveryService.deliveryConfirmations.find(
        (dc) => dc.name === testParams.deliveryConfirmationName,
      );

      if (deliveryConfirmation) {
        newShipmentPOJO.deliveryConfirmation = {
          id: deliveryConfirmation.id,
        }
      }
    }

    return {
      title,
      methodArgs: newShipmentPOJO,
      config,
    };
  }

  buildTestArgs(): Array<TestArgs | undefined> {
    if (Array.isArray(this.config)) {
      return this.config.map((config: CreateShipmentReturnConfigOptions) => {
        return this.buildTestArg(config);
      });
    }
    const config = this.config as CreateShipmentReturnConfigOptions;
    return [this.buildTestArg(config)];
  }

  tests(): Test[] {
    const testArgs = this.buildTestArgs().filter((args) => args !== undefined) as TestArgs[];

    if (testArgs.length === 0) {
      return [];
    }
    return testArgs.map((testArg) => {
      return this.test(
        testArg.title,
        testArg.methodArgs,
        testArg.config,
        async () => {
          const carrierApp = this.app as CarrierApp;

          const transaction = await this.transaction(testArg.config);

          if (!carrierApp.createShipment) {
            throw new Error("createShipment is not implemented");
          }

          const shipmentConfirmation = await carrierApp.createShipment(transaction, testArg.methodArgs);

          // If DeliveryServiceDefinition.isTrackable is true, then the shipment must have a trackingNumber set
          if (this.deliveryService?.isTrackable) {
            const customMsg = "The shipmentConfirmation.isTrackable returned from createShipment must be present when the given deliveryService.isTrackable is set to 'true'";
            expect(shipmentConfirmation.trackingNumber, customMsg).to.be.ok;
          }
        }
      );
    });
  }
}
