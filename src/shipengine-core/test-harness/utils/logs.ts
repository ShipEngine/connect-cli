import * as logSymbols from "log-symbols";
import chalk from 'chalk';

export function successLog(message: string[], nestingLevel = 0): void {
  console.log("  ".repeat(nestingLevel), `${logSymbols.success} ${chalk.green(message.join("\n   "))}`);
}

export function errorLog(error: Error, nestingLevel = 0): void {
  console.log("  ".repeat(nestingLevel), `${logSymbols.error} ${chalk.red(error)}`);
}