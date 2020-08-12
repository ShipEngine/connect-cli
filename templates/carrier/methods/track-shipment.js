"use strict";

/**
 * Returns tracking information for a shipment
 * 
 * View documentation here:
 * https://shipenginestag:439bd542@shipenginestag.wpengine.com/docs/integration-platform/reference/methods/track-shipment
 * 
 * View sample implementation here:
 * https://github.com/ShipEngine/connect-samples/blob/d89b926db889a6d1051f0d8fb3934b79b1f2b757/cargo-inc/src/track-shipment.js
 */
async function trackShipment(transaction, shipment) {
  throw new Error("NotImplementedError");
  // STEP 1: Validation
  // STEP 2: Create the data that the carrier's API expects
  // STEP 3: Call the carrier's API
  // STEP 4: Create the output data that ShipEngine expects
}

module.exports = trackShipment;
