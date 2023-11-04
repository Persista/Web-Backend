const testObject = {
  AI: ["a", "b", "c", "d", "e", "f", "g"],
  User: ["e", "f", "g", "h", "i", "j", "k"],
};

const testString = "User:e;f;g;h;i;j;k;";

export function objectToString(data) {
  const userArray = data.User;

  let res = "User:";

  let answers = userArray.join(";");

  res += answers + ";";

  return res;
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
