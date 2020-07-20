export default function deepMergeObjectsAndFilter(): object {
  // const defaults = {
  //   labelFormat: this.deliveryService.labelFormats[0],
  //   labelSize: this.deliveryService.labelSizes[0],
  //   shipDateTime: tomorrow, // It would prob be a better DX to give the user an enum of relative values "tomorrow", "nextWeek" etc.
  //   shipFrom: shipFrom,
  //   shipTo: buildAddressWithContactInfo(`${destinationCountry}-to`),
  //   weight: {
  //     value: 50.0,
  //     unit: WeightUnit.Pounds,
  //   },
  // };

  // const whiteListKeys = Object.keys(defaults);

  // // This code is filtering any keys in the config that are not white listed
  // // and merging the values with the defaults above
  // const testParams = Object.keys(config)
  //   .filter((key) => whiteListKeys.includes(key))
  //   .reduce((obj, key: string) => {
  //     Reflect.set(obj, key, Reflect.get(config, key));
  //     return obj;
  //   }, defaults);
  return {};
}
