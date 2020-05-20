import { App } from '@shipengine/integration-platform-loader';

export async function runTest(app: App, testFiles: string[]) {
  for (let testFile of testFiles) {
    const module = await import(testFile);

    module.test(app);
  }
}