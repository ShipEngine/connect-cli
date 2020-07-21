import {
  CarrierApp,
  DeliveryService,
  NewShipmentPOJO,
  NewPackagePOJO,
  WeightUnit,
  Country,
} from "@shipengine/integration-platform-sdk";
import Suite from "../runner/suite";
import {
  buildAddress,
  buildAddressWithContactInfo,
} from "../factories/address";
import {
  CreateShipmentDomesticConfigOptions,
  CreateShipmentDomesticTestParams,
} from "../runner/config/create-shipment-domestic";
import { initializeTimeStamps } from "../../utils/time-stamps";
import { getDeliveryServiceByName } from "./utils";
import reduceDefaultsWithConfig from '../utils/reduce-defaults-with-config';
import objectToTestTitle from '../utils/object-to-test-title';
import { DomesticDeliveryService, findDomesticDeliveryService } from '../utils/find-domestic-delivery-service';
import { expect } from "chai";

interface TestArgs {
  title: string;
  methodArgs: NewShipmentPOJO;
  config: any;
}

export class CreateShipmentDomestic extends Suite {
  title = "createShipment_domestic";

  private deliveryService?: DeliveryService | undefined;

  private setDeliveryService(
    config: CreateShipmentDomesticConfigOptions,
  ): void {
    const carrierApp = this.app as CarrierApp;

    if (config.deliveryServiceName) {
      this.deliveryService = getDeliveryServiceByName(
        config.deliveryServiceName,
        carrierApp,
      );

      if (!this.deliveryService)
        throw new Error(
          `deliveryServiceName: ${config.deliveryServiceName} does not exist`,
        );
      return;
    } else {
      const dsCopy = Object.assign(
        [],
        carrierApp.deliveryServices,
      ) as DeliveryService[];
      const deliveryServices = findDomesticDeliveryService(dsCopy);
      const deliveryService = pickDomesticDeliveryService(deliveryServices);
      if (deliveryService) {
        this.deliveryService = deliveryService;
      }
    }
  }

  buildTestArg(
    config: CreateShipmentDomesticConfigOptions,
  ): TestArgs | undefined {
    this.setDeliveryService(config);

    if (!this.deliveryService) return undefined;

    const country = findMatchingDomesticCountry(this.deliveryService);
    const shipFrom = buildAddressWithContactInfo(`${country}-from`);
    const shipTo = buildAddressWithContactInfo(`${country}-to`);
    const { tomorrow } = initializeTimeStamps(shipFrom!.timeZone);

    // Make a best guess at the defaults, need to resolve the default vs config based delivery service early
    // on since that determines what address and associated timezones get generated.
    const defaults: CreateShipmentDomesticTestParams = {
      deliveryServiceName: this.deliveryService.name,
      labelFormat: this.deliveryService.labelFormats[0],
      labelSize: this.deliveryService.labelSizes[0],
      shipDateTime: tomorrow,
      shipFrom: shipFrom!,
      shipTo: shipTo!,
      weight: {
        unit: WeightUnit.Pounds,
        value: 50.0,
      },
      packagingName: this.deliveryService.packaging[0].name,
    };

    if (this.deliveryService.deliveryConfirmations.length > 0) {
      defaults.deliveryConfirmationName = this.deliveryService.deliveryConfirmations[0].name;
    }

    const testParams = reduceDefaultsWithConfig<
      CreateShipmentDomesticTestParams
    >(defaults, config);

    const packagePOJO: NewPackagePOJO = {
      packaging: {
        id: this.deliveryService.packaging[0].id,
      },
      label: {
        size: testParams.labelSize,
        format: testParams.labelFormat,
      },
      weight: {
        value: testParams.weight.value,
        unit: testParams.weight.unit,
      },
    };

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
      ? `it raises an error when creating a new domestic shipment with ${objectToTestTitle(
        testParams,
      )}`
      : `it creates a new domestic shipment with ${objectToTestTitle(
        testParams,
      )}`;

    return {
      title,
      methodArgs: newShipmentPOJO,
      config,
    };
  }

  buildTestArgs(): Array<TestArgs | undefined> {
    if (Array.isArray(this.config)) {
      return this.config.map((config: CreateShipmentDomesticConfigOptions) => {
        return this.buildTestArg(config);
      });
    } else {
      const config = this.config as CreateShipmentDomesticConfigOptions;

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

          carrierApp.createShipment &&
            (await carrierApp.createShipment(transaction, testArg!.methodArgs));
        },
      );
    });
  }
}

/**
 * Currently, just return the first valid domestic delivery service that we have an address for
 */
function pickDomesticDeliveryService(
  deliveryServices: DomesticDeliveryService,
): DeliveryService | undefined {
  for (let ds of deliveryServices) {
    for (let domesticCountry of ds.domesticCountries) {
      if (buildAddress(`${domesticCountry}-from`)) {
        return ds.deliveryService;
      }
    }
  }

  return undefined;
}

function findMatchingDomesticCountry(ds: DeliveryService): Country | undefined {
  for (let country of ds.originCountries) {
    if (ds.destinationCountries.includes(country)) {
      if (buildAddress(`${country}-from`)) {
        return country;
      }
    }
  }
}
