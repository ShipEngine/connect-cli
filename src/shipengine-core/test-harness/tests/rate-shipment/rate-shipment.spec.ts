import { CarrierApp } from '@shipengine/integration-platform-sdk';

export async function test(app: CarrierApp): Promise<void> {
  if(app) {

    console.log("running rate shipment tests");
  }
}
