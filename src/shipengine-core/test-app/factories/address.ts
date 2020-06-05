import {
  AddressPOJO,
  AddressWithContactInfoPOJO,
  Country,
} from "@shipengine/integration-platform-sdk";

export function buildAddressWithContactInfo(
  countryCode: string,
): AddressWithContactInfoPOJO | undefined {
  const countryMap: Record<string, AddressWithContactInfoPOJO> = {
    "US-from": Object.assign(buildAddress("US-from"), {
      name: "John Doe",
      email: "john.doe@gmail.com",
      phoneNumber: "123-456-7890",
    }),
    "US-to": Object.assign(buildAddress("US-to"), {
      name: "Jane Doe",
      email: "Jane.doe@gmail.com",
      phoneNumber: "987-654-3210",
    }),
    "CA-from": Object.assign(buildAddress("CA-from"), {
      name: "John Doe",
      email: "john.doe@gmail.com",
      phoneNumber: "123-456-7890",
    }),
    "CA-to": Object.assign(buildAddress("CA-to"), {
      name: "Jane Doe",
      email: "Jane.doe@gmail.com",
      phoneNumber: "987-654-3210",
    }),
    "MX-from": Object.assign(buildAddress("MX-from"), {
      name: "John Doe",
      email: "john.doe@gmail.com",
      phoneNumber: "123-456-7890",
    }),
    "MX-to": Object.assign(buildAddress("MX-to"), {
      name: "Jane Doe",
      email: "Jane.doe@gmail.com",
      phoneNumber: "987-654-3210",
    }),
  };

  return countryMap[countryCode];
}

export function buildAddress(countryCode: string): AddressPOJO {
  const countryMap: Record<string, AddressPOJO> = {
    "US-from": {
      company: "US International",
      addressLines: ["3800 N Lamar Blvd #220"],
      cityLocality: "Austin",
      stateProvince: "TX",
      postalCode: "78756",
      country: Country.UnitedStates,
      timeZone: "America/Chicago",
    },
    "US-to": {
      company: "Company Inc",
      addressLines: ["333 O'Farrell St"],
      cityLocality: "San Francisco",
      stateProvince: "CA",
      postalCode: "94102",
      country: Country.UnitedStates,
      timeZone: "America/Los_Angeles",
    },
    "CA-from": {
      company: "CN International",
      addressLines: ["145 Richmond St W"],
      cityLocality: "Toronto",
      stateProvince: "ON",
      postalCode: "M5H 2L2",
      country: Country.Canada,
      timeZone: "America/Toronto",
    },
    "CA-to": {
      company: "Company Inc",
      addressLines: ["6083 McKay Ave"],
      cityLocality: "Burnaby",
      stateProvince: "BC",
      postalCode: "B5H 2W7",
      country: Country.Canada,
      timeZone: "America/Vancouver",
    },
    "MX-from": {
      company: "MX International",
      addressLines: ["Blvd. Luis Donaldo Colosio MZA 1", "SM 310"],
      cityLocality: "Cancún",
      stateProvince: "Q.R.",
      postalCode: "77500",
      country: Country.Mexico,
      timeZone: "America/Cancun",
    },
    "MX-to": {
      company: "Company Inc",
      addressLines: ["Carretera Transpeninsular", "km 10.3 Col Cabo del Sol"],
      cityLocality: "Cabo San Lucas",
      stateProvince: "B.C.S.",
      postalCode: "23410",
      country: Country.Mexico,
      timeZone: "America/Chihuahua",
    }
  };

  return countryMap[countryCode];
}
