import { Suite, TestProp, expect } from "../tiny-test";
import { v4 } from "uuid";
import { buildAddress } from "../factories/address";
import { log, logObject } from "../../utils/log-helpers";
import { initializeTimeStamps, getTimeTitle } from "../../utils/time-stamps";
import {
  CarrierApp,
  PickupPackagePOJO,
  PickupCancellationPOJO,
  PickupCancellationReason,
  TransactionPOJO,
  WeightUnit,
} from "@shipengine/integration-platform-sdk";

type CancelPickupsProps = [TransactionPOJO, PickupCancellationPOJO[]];

export class CancelPickupsTestSuite extends Suite {
  title = "cancelPickups";

  tests() {
    const carrierApp = this.app as CarrierApp;

    return this.testProps().map((testProp) => {
      return this.test(testProp.title, async () => {
        if (this.debug) {
          log("input:");
          logObject(testProp.props[0]);
          logObject(testProp.props[1]);
        }

        let result, errorResult;
        try {
          carrierApp.cancelPickups &&
            (result = await carrierApp.cancelPickups(...testProp.props));
        } catch (error) {
          errorResult = error;
        } finally {
          expect(errorResult).to.be.undefined;
          expect(result).to.be.ok;
        }
      });
    });
  }

  private testProps(): TestProp<CancelPickupsProps>[] {
    const carrierApp = this.app as CarrierApp;
    let props: TestProp<CancelPickupsProps>[] = [];

    const cancellationReasons = [
      PickupCancellationReason.CarrierFailedPickup,
      PickupCancellationReason.NotReady,
      PickupCancellationReason.Other,
      PickupCancellationReason.Price,
      PickupCancellationReason.Schedule,
    ];
    const packageWeights = [1.0, 10.0, 100.0];
    const packageUnits = [
      WeightUnit.Grams,
      WeightUnit.Kilograms,
      WeightUnit.Ounces,
      WeightUnit.Pounds,
    ];

    const address = buildAddress(`US-from`);
    const timestamps = initializeTimeStamps(address.timeZone);

    for (let pickupService of carrierApp.pickupServices) {
      for (let reason of cancellationReasons) {
        for (let deliveryService of carrierApp.deliveryServices) {
          for (let packageUnit of packageUnits) {
            for (let packageWeight of packageWeights) {
              for (let pkg of deliveryService.packaging) {
                const packagePOJO: PickupPackagePOJO = {
                  packaging: {
                    id: pkg.id,
                  },
                  weight: {
                    value: packageWeight,
                    unit: packageUnit,
                  },
                };

                let pickupCancellations: PickupCancellationPOJO[] = [
                  {
                    id: v4(),
                    pickupService: pickupService,
                    cancellationID: v4(),
                    reason: reason,
                    address: address,
                    contact: {
                      name: "John Smith",
                    },
                    timeWindows: [
                      {
                        startDateTime: timestamps.today,
                        endDateTime: timestamps.tomorrow,
                      },
                    ],
                    shipments: [
                      {
                        packages: [packagePOJO],
                        deliveryService: deliveryService,
                      },
                    ],
                  },
                ];

                const title = `cancels pickups with pickup service: ${
                  pickupService.name
                }, delivery service: ${deliveryService.name}, package: ${
                  pkg.name
                }, package unit: ${packageUnit}, package weight: ${packageWeight}, time window start: ${getTimeTitle(
                  pickupCancellations[0].timeWindows[0].startDateTime.toString(),
                  timestamps,
                )}, time window end: ${getTimeTitle(
                  pickupCancellations[0].timeWindows[0].endDateTime.toString(),
                  timestamps,
                )}, and reason ${reason}`;

                props.push({
                  title: title,
                  props: [this.transaction, pickupCancellations],
                });
              }
            }
          }
        }
      }
    }

    return props;
  }
}
