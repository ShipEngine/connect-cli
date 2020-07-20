/**
 * Returns a comma seperated string for a given object
 * @param {object} defaultObject - The default object.
 * @param {object} configObject - The config object. Key/values in this object receive precedence.
 */
export default function reduceDefaultsWithConfig<T>(
  defaultObject: T,
  configObject: object,
): T {
  const whiteListKeys = Object.keys(defaultObject);

  // This code is filtering any keys in the config that are not white listed
  // and merging the values with the defaults above
  return Object.keys(configObject)
    .filter((key) => whiteListKeys.includes(key))
    .reduce((obj: any, key: string) => {
      // if (typeof Reflect.get(obj, key) === "object") {
      //   Reflect.set(obj, key, Reflect.get(configObject, key));
      //   return obj;
      // } else {
      //   return Object.assign(obj, Reflect.get(configObject, key));
      // }
      Reflect.set(obj, key, Reflect.get(configObject, key));
      return obj;
    }, defaultObject);
}
