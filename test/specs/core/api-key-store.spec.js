"use strict";

const { expect } = require("chai");
const ApiKeyStore = require("../../../lib/core/api-key-store");

describe("ApiKeyStore", () => {
  describe(".set", async () => {
    it("sets the given ApiKey", async () => {
      const apiKey = "test";
      let setResponse, getResponse, errorResponse;
      try {
        setResponse = await ApiKeyStore.set(apiKey);
        getResponse = await ApiKeyStore.get();
      } catch (error) {
        errorResponse = error;
      }

      expect(errorResponse).to.be.undefined;
      expect(setResponse).to.eql(apiKey);
      expect(getResponse).to.eql(apiKey);
    });
  });

  describe(".get", async () => {
    it("gets the ApiKey", async () => {
      const apiKey = "test";
      let setResponse, getResponse, errorResponse;
      try {
        setResponse = await ApiKeyStore.set(apiKey);
        getResponse = await ApiKeyStore.get();
      } catch (error) {
        errorResponse = error;
      }

      expect(errorResponse).to.be.undefined;
      expect(setResponse).to.eql(apiKey);
      expect(getResponse).to.eql(apiKey);
    });

    it("returns an error when the ApiKey is not present", async () => {
      let errorResponse;
      try {
        await ApiKeyStore.clear();
        await ApiKeyStore.get();
      } catch (error) {
        errorResponse = error;
      }

      expect(errorResponse).to.eql({ message: "key not found" });
    });
  });

  describe(".clear", async () => {
    it("clears the ApiKey", async () => {
      const apiKey = "test";
      let setResponse, getResponse, clearResponse, errorResponse;
      try {
        setResponse = await ApiKeyStore.set(apiKey);
        getResponse = await ApiKeyStore.get();
        clearResponse = await ApiKeyStore.clear();
      } catch (error) {
        errorResponse = error;
      }

      expect(errorResponse).to.be.undefined;
      expect(setResponse).to.eql(apiKey);
      expect(getResponse).to.eql(apiKey);
      expect(clearResponse).to.eql("ok");

      try {
        await ApiKeyStore.get();
      } catch (error) {
        errorResponse = error;
      }
      expect(errorResponse).to.eql({ message: "key not found" });
    });
  });
});
