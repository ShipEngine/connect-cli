import { TransactionPOJO, CarrierApp } from '@shipengine/integration-platform-sdk';
import { successLog, errorLog } from './logs';

export type CarrierTest = [TransactionPOJO, object, string[]]

export async function generateCarrierTests(tests: CarrierTest[], methodToCall: string, app: CarrierApp, description: string): Promise<void> {
  // Check if the user specified a test number to run.
  // TODO: remove this, no longer need to use environment variables since we removed mocha.
  const onlyTestNumber = process.env["TEST-NUMBER"];

  // Description
  console.log(description);

  for (let i = 0; i < tests.length; i++) {
    let generatedTest = tests[i];
    if (!onlyTestNumber || (onlyTestNumber && i === Number(onlyTestNumber) - 1)) {

      // TODO: Add exit code 1 for failed tests.
      try {
        // @ts-ignore
        await app.carrier[methodToCall](generatedTest[0], generatedTest[1]);
        successLog(generatedTest[2], 1);
      }
      catch (error) {
        let err = error as Error;
        errorLog(err), 1;
      }
    }
  }
}
