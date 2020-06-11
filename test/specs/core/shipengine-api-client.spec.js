"use strict";

const { expect } = require("chai");
const nock = require("nock");
const ShipengineApiClient = require("../../../lib/core/shipengine-api-client")
  .default;

const mockDevWebApi = nock("https://dip-webapi-dev.kubedev.sslocal.com");

describe("ShipengineApiClient", () => {
  describe("apps", () => {
    describe("getAll", () => {
      it("returns an array of apps", async () => {
        const apiResponse = [
          {
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
  });

  describe("diagnostics", () => {
    const client = new ShipengineApiClient();

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
