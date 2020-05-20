import { TransactionPOJO, CarrierApp } from '@shipengine/integration-platform-sdk';
import { successLog, errorLog } from './logs';

export type CarrierTest = [TransactionPOJO, object, string[]]

export async function generateCarrierTests(tests: CarrierTest[], methodToCall: string, app: CarrierApp, description: string): Promise<void> {
  // Check if the user specified a test number to run.
  const onlyTestNumber = process.env["TEST-NUMBER"];

  console.log(description);

  for (let i = 0; i < tests.length; i++) {
    let generatedTest = tests[i];
    if (!onlyTestNumber || (onlyTestNumber && i === Number(onlyTestNumber) - 1)) {

      // TODO: error message is not formatted very well, make it more readable for the end user.
      // const carrierMethod = Reflect.get(app.carrier, methodToCall);
      // const carrierMethod = app.carrier[methodToCall];

      try {
        // @ts-ignore
        await app.carrier[methodToCall](generatedTest[0], generatedTest[1]);
        // await expect(carrierMethod(generatedTest[0], generatedTest[1])).to.not.be.rejected;
        // await expect(Reflect.apply(carrierMethod, undefined, [generatedTest[0], generatedTest[1]])).to.not.be.rejected;

        successLog(generatedTest[2], 1);
      }
      catch (error) {
        let err = error as Error;
        errorLog(err), 1;
      }
    }
  }
}
