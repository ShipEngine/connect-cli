"use strict";

const { expect } = require("chai");
const pojo = require("../../../utils/pojo");
const findDeliveryConfirmationByName = require("../../../../../lib/core/test-app/utils/find-delivery-confirmation-by-name")
  .default;

const deliveryConfirmation = pojo.deliveryConfirmation();
const app = pojo.carrierApp({ deliveryConfirmations: [deliveryConfirmation] });

describe("findDeliveryConfirmationByName", () => {
  it("when a delivery confirmation exist for the given name it returns the delivery confirmation", () => {
    const name = "Dummy Confirmation";
    const subject = findDeliveryConfirmationByName(name, app);
    expect(subject.name).to.be.equal(name);
  });

  it("when a delivery confirmation does not exist for the given name it throws an error", () => {
    expect(() => findDeliveryConfirmationByName("invalid", app)).to.throw(
      Error,
      /shipengine.config.js deliveryConfirmationName:/,
    );
  });
});
