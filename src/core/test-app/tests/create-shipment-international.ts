import {
  CarrierApp,
  NewShipmentPOJO,
  NewPackagePOJO,
  WeightUnit,
  DeliveryService,
  Country,
  DeliveryConfirmation,
} from "@shipengine/integration-platform-sdk";
import Suite from "../runner/suite";
import deepMergeObjectsAndFilter from "../utils/deep-merge-objects-and-filter";
import findDeliveryConfirmationByName from "../utils/find-delivery-confirmation-by-name";
import findDeliveryServiceByName from "../utils/find-delivery-service-by-name";
import findInternationalDeliveryService from "../utils/find-international-delivery-service";
import objectToTestTitle from "../utils/object-to-test-title";
import { CreateShipmentInternationalOptions } from "../runner/config";
import { buildAddressWithContactInfo } from "../factories/address";
import { initializeTimeStamps } from "../../utils/time-stamps";

interface TestArgs {
  title: string;
  methodArgs: NewShipmentPOJO;
  config: any;
}

type DomesticDeliveryService = Array<{
  deliveryService: DeliveryService;
  domesticCountries: Country[];
}>;

export class CreateShipmentInternational extends Suite {
  title = "createShipment_international";

  private deliveryService?: DeliveryService;
  private deliveryConfirmation?: DeliveryConfirmation;

  private setDeliveryService(config: CreateShipmentInternationalOptions): void {
    if (config.deliveryServiceName) {
      this.deliveryService = findDeliveryServiceByName(
        config.deliveryServiceName,
        this.app as CarrierApp,
      );
    } else {
      // If a delivery service isnt given via the config lets try and resolve one
      this.deliveryService = findInternationalDeliveryService(
        this.app as CarrierApp,
      );
    }
  }

  private setDeliveryConfirmation(
    config: CreateShipmentInternationalOptions,
  ): void {
    const carrierApp = this.app as CarrierApp;

    if (config.deliveryConfirmationName) {
      this.deliveryConfirmation = findDeliveryConfirmationByName(
        config.deliveryConfirmationName,
        carrierApp,
      );
      return;
    }

    if (
      this.deliveryService &&
      this.deliveryService.deliveryConfirmations.length !== 0 &&
      this.deliveryService.deliveryConfirmations[0]
    ) {
      this.deliveryConfirmation = this.deliveryService.deliveryConfirmations[0];
      return;
    }
  }

  private buildTestArg(
    config: CreateShipmentInternationalOptions,
  ): TestArgs | undefined {
    this.setDeliveryService(config);
    this.setDeliveryConfirmation(config);

    // If we cant resolve a delivery serivice above then we dont have enough info to setup this test
    if (!this.deliveryService) return undefined;

    // this.setOriginCountry(config);
    const originCountry = "US";
    const destinationCountry = "MX";

    // We need to know if the config defines 'shipFrom' so we can set the 'shipDateTime' with the correct timezone
    const shipFrom = config.shipFrom
      ? config.shipFrom
      : buildAddressWithContactInfo(`${originCountry}-from`);
    const { tomorrow } = initializeTimeStamps(shipFrom!.timeZone);

    const defaults = {
      labelFormat: this.deliveryService.labelFormats[0],
      labelSize: this.deliveryService.labelSizes[0],
      shipDateTime: tomorrow, // It would prob be a better DX to give the user an enum of relative values "tomorrow", "nextWeek" etc.
      shipFrom: shipFrom,
      shipTo: buildAddressWithContactInfo(`${destinationCountry}-to`),
      weight: {
        value: 50.0,
        unit: WeightUnit.Pounds,
      },
    };

    // const testParams = deepMergeObjectsAndFilter(defaults, this.config);
    const whiteListKeys = Object.keys(defaults);

    // This code is filtering any keys in the config that are not white listed
    // and merging the values with the defaults above
    const testParams = Object.keys(config)
      .filter((key) => whiteListKeys.includes(key))
      .reduce((obj, key: string) => {
        Reflect.set(obj, key, Reflect.get(config, key));
        return obj;
      }, defaults);

    const packagePOJO: NewPackagePOJO = {
      packaging: {
        id: this.deliveryService.packaging[0].id,
      },
      label: {
        size: testParams.labelSize,
        format: testParams.labelFormat,
      },
      weight: testParams.weight,
    };

    if (this.deliveryConfirmation) {
      packagePOJO.deliveryConfirmation = {
        id: this.deliveryConfirmation.id,
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
      ? `it raises an error when creating a new international shipment with ${objectToTestTitle(
          testParams,
        )}`
      : `it creates a new international shipment with ${objectToTestTitle(
          testParams,
        )}`;

    return {
      title: title,
      methodArgs: newShipmentPOJO,
      config: config,
    };
  }

  private buildTestArgs(): Array<TestArgs | undefined> {
    if (Array.isArray(this.config)) {
      return this.config.map((config: CreateShipmentInternationalOptions) => {
        return this.buildTestArg(config);
      });
    } else {
      const config = this.config as CreateShipmentInternationalOptions;

      return [this.buildTestArg(config)];
    }
  }

  tests() {
    const testArgs = this.buildTestArgs().filter((args) => args !== undefined);

    if (testArgs.length === 0) return [];

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
