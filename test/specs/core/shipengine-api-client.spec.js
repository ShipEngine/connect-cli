"use strict";

const { expect } = require("chai");
const nock = require("nock");
const ShipengineApiClient = require("../../../lib/core/shipengine-api-client")
  .default;

const mockDevWebApi = nock("https://dip-webapi-dev.kubedev.sslocal.com");

describe("ShipengineApiClient", () => {
  describe("apps", () => {
    describe("create", () => {
      it("returns an app", async () => {
        const apiResponse = {
          id: "a9a84a1c-55ce-49f3-8cd7-f088e93ccada",
          name: "test app",
          type: "carrier",
        };
        mockDevWebApi.post("/api/apps").reply(200, apiResponse);

        const client = new ShipengineApiClient("valid key");
        let response, errorResponse;
        try {
          response = await client.apps.create({
            name: "test app",
            type: "carrier",
          });
        } catch (error) {
          errorResponse = error;
        }

        expect(errorResponse).to.be.undefined;
        expect(response).to.eql(apiResponse);
      });

      it("returns an error when given an invalid API key", async () => {
        const apiResponse = {
          statusCode: 401,
          name: "unauthorized",
          errors: [
            {
              message: "invalid auth",
            },
          ],
          status: 401,
        };
        mockDevWebApi.post("/api/apps").reply(401, apiResponse);

        const client = new ShipengineApiClient("invalid");
        let response, errorResponse;
        try {
          response = await client.apps.create({
            name: "test app",
            type: "carrier",
          });
        } catch (error) {
          errorResponse = error;
        }

        expect(response).to.be.undefined;
        expect(errorResponse).to.be.eql(apiResponse);
      });
    });

    describe("getAll", () => {
      it("returns an array of apps", async () => {
        const apiResponse = [
          {
            id: "a9a84a1c-55ce-49f3-8cd7-f088e93ccada",
            name: "test app",
            type: "carrier",
          },
        ];
        mockDevWebApi.get("/api/apps").reply(200, apiResponse);

        const client = new ShipengineApiClient("valid key");
        let response, errorResponse;
        try {
          response = await client.apps.getAll();
        } catch (error) {
          errorResponse = error;
        }

        expect(errorResponse).to.be.undefined;
        expect(response).to.eql(apiResponse);
      });

      it("returns an error when given an invalid API key", async () => {
        const apiResponse = {
          statusCode: 401,
          name: "unauthorized",
          errors: [
            {
              message: "invalid auth",
            },
          ],
          status: 401,
        };
        mockDevWebApi.get("/api/apps").reply(401, apiResponse);

        const client = new ShipengineApiClient("invalid");
        let response, errorResponse;
        try {
          response = await client.apps.getAll();
        } catch (error) {
          errorResponse = error;
        }

        expect(response).to.be.undefined;
        expect(errorResponse).to.be.eql(apiResponse);
      });
    });

    describe("getById", () => {
      it("returns an app", async () => {
        const apiResponse = {
          id: "a9a84a1c-55ce-49f3-8cd7-f088e93ccada",
          name: "test app",
          type: "carrier",
        };
        mockDevWebApi
          .get("/api/apps/a9a84a1c-55ce-49f3-8cd7-f088e93ccada")
          .reply(200, apiResponse);

        const client = new ShipengineApiClient("valid key");
        let response, errorResponse;
        try {
          response = await client.apps.getById(
            "a9a84a1c-55ce-49f3-8cd7-f088e93ccada",
          );
        } catch (error) {
          errorResponse = error;
        }

        expect(errorResponse).to.be.undefined;
        expect(response).to.eql(apiResponse);
      });

      it("returns an error when given an invalid API key", async () => {
        const apiResponse = {
          statusCode: 401,
          name: "unauthorized",
          errors: [
            {
              message: "invalid auth",
            },
          ],
          status: 401,
        };
        mockDevWebApi.get("/api/apps/test-id").reply(401, apiResponse);

        const client = new ShipengineApiClient("invalid");
        let response, errorResponse;
        try {
          response = await client.apps.getById("test-id");
        } catch (error) {
          errorResponse = error;
        }

        expect(response).to.be.undefined;
        expect(errorResponse).to.be.eql(apiResponse);
      });
    });

    describe("getByName", () => {
      it("returns an app", async () => {
        const apiResponse = [
          {
            id: "a9a84a1c-55ce-49f3-8cd7-f088e93ccada",
            name: "test-app",
            type: "carrier",
          },
        ];
        mockDevWebApi.get("/api/apps?name=test-app").reply(200, apiResponse);

        const client = new ShipengineApiClient("valid key");
        let response, errorResponse;
        try {
          response = await client.apps.getByName("test-app");
        } catch (error) {
          errorResponse = error;
        }

        expect(errorResponse).to.be.undefined;
        expect(response).to.eql(apiResponse[0]);
      });

      it("returns an error when given an invalid API key", async () => {
        const apiResponse = {
          statusCode: 401,
          name: "unauthorized",
          errors: [
            {
              message: "invalid auth",
            },
          ],
          status: 401,
        };
        mockDevWebApi.get("/api/apps?name=test-app").reply(401, apiResponse);

        const client = new ShipengineApiClient("invalid");
        let response, errorResponse;
        try {
          response = await client.apps.getByName("test-app");
        } catch (error) {
          errorResponse = error;
        }

        expect(response).to.be.undefined;
        expect(errorResponse).to.be.eql(apiResponse);
      });
    });
  });

  describe("diagnostics", () => {
    const client = new ShipengineApiClient("api key");

    describe("heartBeat", () => {
      it("returns a pulse", async () => {
        mockDevWebApi.get("/api/diagnostics/heartbeat").reply(200, {
          pulse: "yes",
        });

        let response, errorResponse;
        try {
          response = await client.diagnostics.heartBeat();
        } catch (error) {
          errorResponse = error;
        }

        expect(errorResponse).to.be.undefined;
        expect(response).to.eql({
          pulse: "yes",
        });
      });
    });
  });

  describe("users", () => {
    describe("getCurrent", () => {
      it("returns a user", async () => {
        const apiResponse = { name: "test", email: "test@test.user.com" };
        mockDevWebApi.get("/api/diagnostics/whoami").reply(200, apiResponse);
        const client = new ShipengineApiClient("valid key");
        let response, errorResponse;
        try {
          response = await client.users.getCurrent();
        } catch (error) {
          errorResponse = error;
        }

        expect(errorResponse).to.be.undefined;
        expect(response).to.eql(apiResponse);
      });

      it("returns an error when given an invalid API key", async () => {
        const apiResponse = {
          statusCode: 401,
          name: "unauthorized",
          errors: [
            {
              message: "invalid auth",
            },
          ],
          status: 401,
        };
        mockDevWebApi.get("/api/diagnostics/whoami").reply(401, apiResponse);
        const client = new ShipengineApiClient("invalid");
        let response, errorResponse;
        try {
          response = await client.users.getCurrent();
        } catch (error) {
          errorResponse = error;
        }

        expect(response).to.be.undefined;
        expect(errorResponse).to.be.eql(apiResponse);
      });
    });
  });
});
