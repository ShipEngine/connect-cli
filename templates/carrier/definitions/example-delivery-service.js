"use strict";

module.exports = {
  id: "<%- _uuidv4 %>",
  name: "Example Delivery Service",
  description:
    "This is an example delivery service. Please remove and define your own.",
  class: "ground",
  deliveryConfirmations: [
    {
      id: "<%- _uuidv4 %>",
      name: "Example Delivery Confirmation",
      description:
        "This is an example delivery confirmation. Please remove and define your own.",
      type: "delivery",
    },
  ],
  grade: "standard",
  isInsurable: true,
  isTrackable: false,
  labelFormats: ["pdf"],
  labelSizes: ["4x8"],
  originCountries: ["US", "CA", "MX"],
  destinationCountries: ["US", "CA", "MX"],
  packaging: [
    {
      id: "<%- _uuidv4 %>",
      name: "Box",
      description:
        "Your own box. Cannot be longer than 36 inches or weigh more than 150 pounds",
      requiresWeight: true,
      requiresDimensions: true,
    },
  ],
  serviceArea: "international",
};
