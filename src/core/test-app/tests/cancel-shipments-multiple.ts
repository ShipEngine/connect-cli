import { DeliveryService, WeightUnit, LengthUnit } from "@shipengine/connect-sdk";
import { CarrierApp, NewShipmentPOJO, NewPackagePOJO, ShipmentCancellationPOJO } from "@shipengine/connect-sdk/lib/internal";
import Suite from "../runner/suite";
import { initializeTimeStamps } from "../../utils/time-stamps";
import reduceDefaultsWithConfig from "../utils/reduce-defaults-with-config";
import objectToTestTitle from "../utils/object-to-test-title";
import useDomesticShippingAddress from "../utils/use-domestic-shipment-addresses";

import { findDomesticDeliveryService } from "../utils/find-domestic-delivery-service";
import { expect } from "chai";
import findDeliveryServiceByName from "../utils/find-delivery-service-by-name";
import { CancelShipmentsMultipleConfigOptions, CancelShipmentsMultipleTestParams } from "../runner/config/cancel-shipments-multiple";
import { v4 } from "uuid";
import Test from '../runner/test';


interface TestArgs {
  title: string;
  methodArgs: NewShipmentPOJO[];
  config: unknown;
}

/**
 * Test an individual cancellation of one shipment.
 */
export class CancelShipmentsMultiple extends Suite {
  title = "cancelShipments_multiple";

  private setDeliveryService(
    deliveryServiceName?: string
  ): DeliveryService {
    const carrierApp = this.app as CarrierApp;

    if (deliveryServiceName) {
      return findDeliveryServiceByName(
        deliveryServiceName,
        carrierApp,
      );
    }

    return findDomesticDeliveryService(carrierApp);
  }

  buildTestArg(
    config: CancelShipmentsMultipleConfigOptions,
  ): TestArgs | undefined {


    const userOverrides = config.map((shipment) => {

      const deliveryService = this.setDeliveryService(shipment.deliveryServiceName);

      let shipFrom;
      let shipTo;
      try {
        [shipFrom, shipTo] = useDomesticShippingAddress(deliveryService);
      } catch { }

      const { tomorrow } = initializeTimeStamps();
      return {
        deliveryService,
        shipFrom,
        shipTo,
        shipDateTime: tomorrow
      }
    });

    // Make a best guess at the defaults, need to resolve the default vs config based delivery service early
    // on since that determines what address and associated timezones get generated.
    // const defaults: CancelShipmentsMultipleTestParams = {
    //   deliveryServiceName: this.deliveryService.name,
    //   shipDateTime: tomorrow,
    //   shipFrom: shipFrom,
    //   shipTo: shipTo,
    //   weight: {
    //     unit: WeightUnit.Pounds,
    //     value: 50.0,
    //   },
    //   dimensions: {
    //     length: 12,
    //     width: 12,
    //     height: 12,
    //     unit: LengthUnit.Inches
    //   }
    // };


    const defaults: CancelShipmentsMultipleTestParams = userOverrides.map((test) => {
      return {
        deliveryServiceName: test.deliveryService.name,
        shipDateTime: test.shipDateTime,
        shipFrom: test.shipFrom,
        shipTo: test.shipTo,
        weight: {
          unit: WeightUnit.Pounds,
          value: 50.0,
        },
        dimensions: {
          length: 12,
          width: 12,
          height: 12,
          unit: LengthUnit.Inches
        }
      }
    });

    const testParams = reduceDefaultsWithConfig<
      CancelShipmentsMultipleTestParams
    >(defaults, config);

    const shipments = [];

    for (const shipment of testParams) {
      if (!shipment.shipFrom || !shipment.shipTo) return undefined;

      const deliveryService = findDeliveryServiceByName(shipment.deliveryServiceName, this.app as CarrierApp);

      const packagePOJO: NewPackagePOJO = {
        packaging: {
          id: deliveryService.packaging[0].id
        },
        label: {
          size: deliveryService.labelSizes[0],
          format: deliveryService.labelFormats[0],
        },
        weight: {
          value: shipment.weight.value,
          unit: shipment.weight.unit,
        },
        dimensions: {
          length: shipment.dimensions.length,
          width: shipment.dimensions.width,
          height: shipment.dimensions.height,
          unit: shipment.dimensions.unit
        }
      };

      const newShipmentPOJO: NewShipmentPOJO = {
        deliveryService: {
          id: deliveryService.id,
        },
        shipFrom: shipment.shipFrom,
        shipTo: shipment.shipTo,
        shipDateTime: shipment.shipDateTime,
        packages: [packagePOJO],
      };

      shipments.push(newShipmentPOJO);
    }

    

    const title = config.expectedErrorMessage
      ? `it raises an error when cancelling a shipment with ${objectToTestTitle(
        testParams,
      )}`
      : `it cancels a shipment with ${objectToTestTitle(
        testParams,
      )}`;

    return {
      title,
      methodArgs: shipments,
      config,
    };
  }

  buildTestArgs(): Array<TestArgs | undefined> {
    if (Array.isArray(this.config)) {
      return this.config.map((config: CancelShipmentsMultipleConfigOptions) => {
        return this.buildTestArg(config);
      });
    }
    const config = this.config as CancelShipmentsMultipleConfigOptions;
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

          if (!carrierApp.cancelShipments) {
            throw new Error("cancelShipments is not implemented");
          }

          for(const shipment of testArg.methodArgs) {
            const shipmentConfirmation = await carrierApp.createShipment(transaction, shipment);
  
            const cancellationID = v4();
            const shipmentCancellations: ShipmentCancellationPOJO[] = [{
              cancellationID,
              trackingNumber: shipmentConfirmation.trackingNumber
            }];
  
            const shipmentCancellationConfirmation = await carrierApp.cancelShipments(transaction, shipmentCancellations);
  
            const customMsg = `The shipmentCancellationConfirmation cancellationID does not match the one that was included in the shipmentCancellation: ${cancellationID}`;
            expect(shipmentCancellationConfirmation[0].cancellationID).to.equal(cancellationID, customMsg);
          }
        }
      );
    });
  }
}
