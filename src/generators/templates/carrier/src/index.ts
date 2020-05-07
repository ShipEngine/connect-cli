import { CarrierApp } from "@shipengine/integration-platform-sdk";

export const add = (a: number, b: number) => a + b;

export const config: CarrierApp = {
  type: "carrier",

  getOrders() {
    const orderPayload = {
      page: 1,
      pages: 1,
      orders: [],
    };

    return orderPayload;
  },

  services: [],
  packageType: [],
  logo: "",
};
