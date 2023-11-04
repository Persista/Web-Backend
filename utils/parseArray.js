export function objectToString(data) {
  const parts = [];

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const values = data[key].join(";");
      parts.push(`${key}:${values}`);
    }
  }

  return parts.join("-");
}

export function stringToObject(string) {
  const parts = string.split("-");
  const result = {};

  for (const part of parts) {
    const [key, values] = part.split(":");
    const valueArray = values.split(";");
    result[key] = valueArray;
  }

  return result;
}
