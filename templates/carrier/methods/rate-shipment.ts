import {
  RateCriteria,
  RatePOJO,
  Transaction,
} from "@shipengine/integration-platform-sdk";
import { Session } from "./session";

/**
 * Generates shipping rates for a shipment
 */
export default async function rateShipment(
  transaction: Transaction<Session>,
  shipment: RateCriteria,
): Promise<RatePOJO[]> {
  throw new Error("NotImplementedError");
  // STEP 1: Validation
  // STEP 2: Create the data that the carrier's API expects
  // STEP 3: Call the carrier's API
  // STEP 4: Create the output data that ShipEngine expects
}
