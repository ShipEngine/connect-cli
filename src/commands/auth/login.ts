// import BaseCommand from "../../base-command";
// import { flags } from "@oclif/command";
// import cli from "cli-ux";

// export default class Login extends BaseCommand {
//   static description = "login with your ShipEngine API key";

//   static aliases = ["login"];

//   static flags = {
//     help: flags.help({ char: "h" }),
//   };

//   // async run() {
//   //   //     if (!apiClient.isLoggedIn) {
//   //   //       let success = false;
//   //   //       while(!success) {
//   //   //          success = await apiClient.login();
//   //   //       }
//   //   //     }
//   // }

//   async run() {
//     this.parse(Login);

//     try {
//       const currentCredential = await getCredential();

//       this.log(
//         `\nYou are currently logged in with the API Key: ${obfuscateApiKey(
//           currentCredential,
//         )}`,
//       );

//       const wishToContinue = await cli.prompt(
//         "\nDo you with to login with a different API Key? (y,n)",
//       );

//       if (wishToContinue != "n" && wishToContinue != "y") {
//         this.error(
//           `'${wishToContinue}' is not a valid option. Please enter 'y' or 'n'`,
//           { exit: 1 },
//         );
//         return;
//       }
//       if (wishToContinue === "n") {
//         this.log(
//           `\nYou will remained logged in with the API Key: ${obfuscateApiKey(
//             currentCredential,
//           )}`,
//         );
//         return;
//       }
//     } catch {
//       // No account currently logged in
//     }

//     const apiKey = await cli.prompt(
//       "Please enter your ShipEngine engine API Key",
//       {
//         type: "mask",
//       },
//     );

//     try {
//       await setCredential(apiKey);
//     } catch (error) {
//       clearCredential();
//       this.error(error, { exit: 1 });
//     }

//     try {
//       // Would rather use a /ping or /status endpoint here
//       await new ShipEngine(apiKey).listCarriers();
//       cli.action.start("verifying account");
//     } catch {
//       clearCredential();
//       return this.error("The given API Key is not valid.", {
//         exit: 1,
//       });
//     } finally {
//       cli.action.stop();
//     }

//     this.log("\nYou have successfully logged in.");
//   }
// }
