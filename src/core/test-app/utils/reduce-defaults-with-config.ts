import merge from "deepmerge";

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

  const filteredConfigObject = Object.keys(configObject)
    .filter((key) => whiteListKeys.includes(key))
    .reduce((obj: any, key: string) => {
      Reflect.set(obj, key, Reflect.get(configObject, key));
      return obj;
    }, {});

  return merge<T>(defaultObject, filteredConfigObject);
}
