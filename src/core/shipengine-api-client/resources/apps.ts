// export default class Apps {
//   private client: ApiClient;

//   constructor(apiClient: ApiClient) {
//     this.client = apiClient;
//   }

//   /**
//    * Fetch the admin for the current API token.
//    * @param params The session params.
//    * @returns {Promise} Promise object that resolves to an Admin object.
//    */
//   async create(): Promise<Admin> {
//     try {
//       const response = await this.client.call({
//         endpoint: "admins/me",
//         method: "GET",
//         token: this.client.apiToken,
//       });

//       return Promise.resolve(response.admin);
//     } catch (errorData) {
//       return Promise.reject(errorData.errors);
//     }
//   }

//   /**
//    * Create a new session token for the given admin.
//    * @param params The session params.
//    * @param {string} params.email The email of the admin.
//    * @param {string} params.password The password for the admin.
//    * @returns {Promise} Promise object that resolves to an Admin object.
//    */
//   async listAll({
//     email,
//     password,
//   }: {
//     email: string;
//     password: string;
//   }): Promise<Admin> {
//     try {
//       const response = await this.client.call({
//         endpoint: "sessions",
//         method: "POST",
//         body: { email, password },
//       });

//       return Promise.resolve(response.admin);
//     } catch (errorData) {
//       return Promise.reject(errorData.errors);
//     }
//   }
// }
