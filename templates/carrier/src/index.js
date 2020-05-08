exports.add = (a, b) => a + b;

exports.app = {
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
