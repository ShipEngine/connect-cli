import {
  CarrierApp,
  DeliveryService,
  RateCriteriaPOJO,
  WeightUnit,
  PackageRateCriteriaPOJO,
} from "@shipengine/integration-platform-sdk";
import Suite from "../runner/suite";
import { initializeTimeStamps } from "../../utils/time-stamps";
import { RateShipmentTestParams, RateShipmentConfigOptions } from "../runner/config/rate-shipment";
import reduceDefaultsWithConfig from "../utils/reduce-defaults-with-config";
import objectToTestTitle from "../utils/object-to-test-title";
import useShipmentAddresses from '../utils/use-shipment-addresses';
import findDeliveryServiceByName from '../utils/find-delivery-service-by-name';

interface TestArgs {
  title: string;
  methodArgs: RateCriteriaPOJO;
  config: any;
  testParams: RateShipmentTestParams;
}

export class RateShipment extends Suite {
  title = "rateShipment";

  private deliveryService: DeliveryService | undefined;

  private setDeliveryService(config: RateShipmentConfigOptions): void {
    const carrierApp = this.app as CarrierApp;

    if (config.deliveryServiceName) {
      this.deliveryService = findDeliveryServiceByName(config.deliveryServiceName, carrierApp);
    }

    else if (carrierApp.deliveryServices) {
      for (let ds of carrierApp.deliveryServices) {
        let [shipFrom, shipTo] = useShipmentAddresses(ds);
        if (shipFrom && shipTo) {
          this.deliveryService = ds;
        }
      }
    }
  }

  buildTestArg(config: RateShipmentConfigOptions): TestArgs | undefined {
    const carrierApp = this.app as CarrierApp;
    this.setDeliveryService(config);

    if (!this.deliveryService) return undefined;
    const [shipFrom, shipTo] = useShipmentAddresses(this.deliveryService);

    if (!shipTo || !shipFrom) return undefined;

    const { tomorrow } = initializeTimeStamps();

    const defaults: RateShipmentTestParams = {
      deliveryServiceName: this.deliveryService.name,
      shipDateTime: tomorrow,
      shipFrom: shipFrom,
      shipTo: shipTo,
      weight: {
        unit: WeightUnit.Pounds,
        value: 50.0
      },
      packagingName: this.deliveryService.packaging[0].name
    };

    const testParams = reduceDefaultsWithConfig<
      RateShipmentTestParams
    >(defaults, config);

    const packageRateCriteriaPOJO: PackageRateCriteriaPOJO = {
      packaging: [{
        id: this.deliveryService.packaging[0].id,
      }],
      weight: {
        value: testParams.weight.value,
        unit: testParams.weight.unit,
      }
    };

    let RateCriteriaPOJO: RateCriteriaPOJO = {
      deliveryService: findDeliveryServiceByName(this.deliveryService.name, carrierApp),
      shipFrom: testParams.shipFrom,
      shipTo: testParams.shipTo!,
      shipDateTime: testParams.shipDateTime,
      packages: [packageRateCriteriaPOJO]
    };

    const title = config.expectedErrorMessage
      ? `it raises an error when creating a new shipment rate with ${objectToTestTitle(
        testParams,
      )}`
      : `it creates a new shipment rate with ${objectToTestTitle(
        testParams,
      )}`;

    return {
      title,
      methodArgs: RateCriteriaPOJO,
      config,
      testParams
    };
  }

  buildTestArgs(): Array<TestArgs | undefined> {
    if (Array.isArray(this.config)) {
      return this.config.map((config: RateShipmentConfigOptions) => {
        return this.buildTestArg(config);
      });
    } else {
      const config = this.config as RateShipmentConfigOptions;

      return [this.buildTestArg(config)];
    }
  }

  tests() {
    const testArgs = this.buildTestArgs().filter(args => args !== undefined) as TestArgs[];

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

          // This should never actually throw because we handle this case up stream.
          if (!carrierApp.rateShipment) {
            throw new Error("rateShipment is not implemented");
          }

          const rates = await carrierApp.rateShipment!(transaction, testArg!.methodArgs);

          //Check that the delivery service that was passed in is included in the response
          if (!rates.find(rate => rate.deliveryService.id === testArg.methodArgs!.deliveryService!.id)) {
            const missingDS = carrierApp.deliveryServices.find(service => service.id === testArg.methodArgs!.deliveryService!.id);

            throw new Error(`Rate for delivery service '${missingDS!.name}' is missing from the response`);
          }
        }
      );
    });
  }
}
