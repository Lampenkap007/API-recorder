const fs = require("fs");
let iteration = 0;

const folderName = "Recording1";

async function saveData() {
  const response = await fetch("http://api.open-notify.org/iss-now.json");
  const data = await response.json();
  console.log(data);

  fs.writeFile(
    "./" + folderName + "/" + iteration + ".json",
    JSON.stringify(data),
    (err) => {
      if (err) {
        console.error(err);
      }
    }
  );
}

try {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }
} catch (err) {
  console.error(err);
}

setInterval(() => {
  saveData();
  iteration = iteration + 1;
}, 1000);
