// public async validateAPIKey(apiKey: string): Promise<void> {
//     try {
//       // Endpoint will either return a 200 for sucess or 401 for an unauthorized
//       await axios({
//         method: "get",
//         url:
//           "https://dip-webapi-dev.kubedev.sslocal.com/api/diagnostics/whoami",
//         headers: {
//           "api-key": apiKey,
//         },
//       });
//     } catch (error) {
//       if (error.response && error.response.data.statusCode === 401) {
//         error.message = "Invalid API Key";
//       }
//       const err = error as Error;

//       throw err;
//     }
//   }
