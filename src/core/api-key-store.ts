import netrc from "netrc";

function key(): string {
  // if (process.env.NODE_ENV === "test") {
  //   return "shipenginetest.com";
  // } else {
  //   return "shipengine.com";
  // }
  return "shipengine.com";
}

export async function get(): Promise<string> {
  const myNetrc = netrc();
  let seNetRC = myNetrc[key()] as { apiKey?: string };

  if (!seNetRC || !seNetRC.apiKey) {
    return Promise.reject({ message: "key not found" });
  }

  return Promise.resolve(seNetRC.apiKey);
}

export async function set(apiKey: string): Promise<string> {
  const myNetrc = netrc();

  Object.assign((myNetrc[key()] = {}), { apiKey });

  netrc.save(myNetrc);

  return Promise.resolve(apiKey);
}

export async function clear(): Promise<string> {
  const myNetrc = netrc();

  Object.assign((myNetrc[key()] = {}), {});

  netrc.save(myNetrc);

  return Promise.resolve("ok");
}
