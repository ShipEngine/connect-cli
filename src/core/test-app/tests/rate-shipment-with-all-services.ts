import {
  WeightUnit,
} from "@shipengine/connect-sdk";

import { CarrierApp, RateCriteriaPOJO, PackageRateCriteriaPOJO } from "@shipengine/connect-sdk/lib/internal";
import Suite from "../runner/suite";
import { initializeTimeStamps } from "../../utils/time-stamps";
import { RateShipmentWithAllServicesTestParams, RateShipmentWithAllServicesConfigOptions } from "../runner/config/rate-shipment-with-all-services";
import reduceDefaultsWithConfig from "../utils/reduce-defaults-with-config";
import objectToTestTitle from "../utils/object-to-test-title";
import { findMatchingOriginAndDestinationCountries } from '../utils/find-matching-origin-and-destination-countries';
import { buildAddressWithContactInfo } from '../factories/address';

interface TestArgs {
  title: string;
  methodArgs: RateCriteriaPOJO;
  config: any;
  testParams: RateShipmentWithAllServicesTestParams;
}

export class RateShipmentWithAllServices extends Suite {
  title = "rateShipment_with_all_services";

  buildTestArg(config: RateShipmentWithAllServicesConfigOptions): TestArgs | undefined {
    const carrierApp = this.app as CarrierApp;
    if (carrierApp.deliveryServices.length < 2) return undefined;

    let matchingCountries
    try {
      matchingCountries = findMatchingOriginAndDestinationCountries(Reflect.get(carrierApp, "deliveryServices"));
    } catch {
      return undefined;
    }

    const shipFrom = buildAddressWithContactInfo(`${matchingCountries.originCountries[0]}-from`);
    const shipTo = buildAddressWithContactInfo(`${matchingCountries.destinationCountries[0]}-to`);

    if (!shipTo || !shipFrom) return undefined;

    const { tomorrow } = initializeTimeStamps();

    const defaults: RateShipmentWithAllServicesTestParams = {
      shipDateTime: tomorrow,
      shipFrom: shipFrom,
      shipTo: shipTo,
      weight: {
        unit: WeightUnit.Pounds,
        value: 50.0
      }
    };

    const testParams = reduceDefaultsWithConfig<
      RateShipmentWithAllServicesTestParams
    >(defaults, config);

    const packageRateCriteriaPOJO: PackageRateCriteriaPOJO = {
      weight: {
        value: testParams.weight.value,
        unit: testParams.weight.unit,
      }
    };

    const RateCriteriaPOJO: RateCriteriaPOJO = {
      deliveryService: undefined,
      shipFrom: testParams.shipFrom,
      shipTo: testParams.shipTo!,
      shipDateTime: testParams.shipDateTime,
      packages: [packageRateCriteriaPOJO]
    };

    const title = config.expectedErrorMessage
      ? `it raises an error when creating a new shipment rate with multiple services with ${objectToTestTitle(
        testParams,
      )}`
      : `it creates a new shipment rate with multiple services with ${objectToTestTitle(
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
      return this.config.map((config: RateShipmentWithAllServicesConfigOptions) => {
        return this.buildTestArg(config);
      });
    }
    const config = this.config as RateShipmentWithAllServicesConfigOptions;
    return [this.buildTestArg(config)];
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

          await carrierApp.rateShipment!(transaction, testArg!.methodArgs);
        },
      );
    });
  }
}
