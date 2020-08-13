import { Transaction, SalesOrderShipment } from "@shipengine/connect-sdk";
import { Session } from "./session";

/**
 * Called when shipment is created
 */
export default async function shipmentCreated(
  transaction: Transaction<Session>,
  shipment: SalesOrderShipment,
): Promise<void> {
  throw new Error("NotImplementedError");
  // STEP 1: Validation
  // STEP 2: Create the data that the carrier's API expects
  // STEP 3: Call the carrier's API
  // Step 4: Create the output data that ShipEngine expects
}
