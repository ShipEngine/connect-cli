import Suite from "./suite";
import { App } from "../../utils/types";
import { Runner, RunnerResults } from "./runner";
import { v4 } from "uuid";
import { readFile } from "../../utils/read-file";

function filterTests(grep: string, suites: Suite[]): Suite[] {
  let tempSuites = suites.filter((suite) => suite.title === grep);

  if (tempSuites.length === 0) {
    tempSuites = suites.filter((suite) => {
      let tests = suite._testCache.filter((test) => test.sha.includes(grep));
      if (tests.length === 1) {
        suite.testCache = tests;
        return true;
      } else {
        return false;
      }
    });
  }

  return tempSuites;
}

interface TinyStaticConfig {
  sessionMock?: object;
}

async function loadStaticConfig(): Promise<TinyStaticConfig> {
  let staticConfig: TinyStaticConfig = {};

  try {
    staticConfig = await readFile<TinyStaticConfig>(
      `${process.cwd()}/shipengine.config.js`,
    );
    return staticConfig;
  } catch {
    return {};
  }
}

interface TinyOptions {
  grep: string | undefined;
  failFast: boolean;
  concurrency: number;
  debug: boolean;
}

export default function Tiny(
  app: App,
  suiteModules: any[],
  { grep, failFast = false, concurrency = 1, debug = false }: TinyOptions,
) {
  process.env.NODE_ENV = "test";

  const options = { grep, failFast, concurrency, debug };

  return {
    run: async (): Promise<RunnerResults> => {
      const staticConfig = await loadStaticConfig();
      const sessionMock = staticConfig.sessionMock
        ? staticConfig.sessionMock
        : {};
      const transactionWithMockSession = {
        id: v4(),
        isRetry: false,
        useSandbox: false,
        session: sessionMock,
      };

      let suites = suiteModules.map(
        (suiteModule) => new suiteModule(app, transactionWithMockSession),
      ) as Suite[];

      if (options.grep) {
        suites = filterTests(options.grep, suites);
      }

      return await Runner(suites, options);
    },
  };
}
