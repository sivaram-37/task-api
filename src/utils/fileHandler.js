const fs = require("fs");

const getData = () => {
  const data = fs.readFileSync("./db.json");
  return JSON.parse(data);
};

const saveData = (data) => {
  fs.writeFileSync("./db.json", JSON.stringify(data, null, 2));
};

module.exports = {
  getData,
  saveData,
};
