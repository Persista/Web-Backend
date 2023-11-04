const testObject = {
  AI: ["a", "b", "c", "d", "e", "f", "g"],
  User: ["e", "f", "g", "h", "i", "j", "k"],
};

export function objectToString(data) {
  for(key in data) {
    data[key] = data[key].join(";");
  }
}

export function stringToObject(string) {
  const array = string.split(":");

  const userArray = array[1].split(";");
  userArray.pop();

  const res = {
    User: userArray,
  };

  return res;
}
