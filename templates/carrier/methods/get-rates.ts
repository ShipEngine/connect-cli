import {
  RateCriteria,
  RateQuotePOJO,
  Transaction,
} from "@shipengine/integration-platform-sdk";

/**
 * Gets shipping rate quotes for the specified criteria
 */
export default async function getRates(
  transaction: Transaction,
  criteria: RateCriteria,
): Promise<RateQuotePOJO> {
  // STEP 1: Validation
  // STEP 2: Create the data that the carrier's API expects
  // STEP 3: Call the carrier's API
  // STEP 4: Create the output data that ShipEngine expects
}

export { getRates };
