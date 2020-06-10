"use strict";

const { expect } = require("chai");
const ShipengineApiClient = require("../../../lib/core/shipengine-api-client")
  .default;

describe("ShipengineApiClient", () => {
  describe("apps", () => {
    describe("getAll", () => {
      it("returns an array of apps", async () => {
        const client = new ShipengineApiClient("DGD1puA4Bq267Vnvya1NZz");
        let response, errorResponse;
        try {
          response = await client.apps.getAll();
        } catch (error) {
          errorResponse = error;
        }

        expect(errorResponse).to.be.undefined;
        expect(response).to.eql([]);
      });

      it("returns an error when given an invalid API key", async () => {
        const client = new ShipengineApiClient("invalid");
        let response, errorResponse;
        try {
          response = await client.apps.getAll();
        } catch (error) {
          errorResponse = error;
        }

        expect(response).to.be.undefined;
        expect(errorResponse).to.be.ok;
      });
    });
  });

  describe("diagnostics", () => {
    const client = new ShipengineApiClient();

    describe("heartBeat", () => {
      it("returns a pulse", async () => {
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
        const client = new ShipengineApiClient("DGD1puA4Bq267Vnvya1NZz");
        let response, errorResponse;
        try {
          response = await client.users.getCurrent();
        } catch (error) {
          errorResponse = error;
        }

        expect(errorResponse).to.be.undefined;
        expect(response).to.eql({
          name: "pierce",
          email: "pierce.harmon@shipengine.com",
        });
      });

      it("returns an error when given an invalid API key", async () => {
        const client = new ShipengineApiClient("invalid");
        let response, errorResponse;
        try {
          response = await client.users.getCurrent();
        } catch (error) {
          errorResponse = error;
        }

        expect(response).to.be.undefined;
        expect(errorResponse).to.be.ok;
      });
    });
  });
});
