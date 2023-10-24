const fs = require("fs");
const zlib = require("zlib");

let iteration = 0;
const folderName = "PositionData";

try {
  if (!fs.existsSync("./savedData/" + folderName)) {
    fs.mkdirSync("./savedData/" + folderName);
  }
} catch (err) {
  console.error(err);
}

async function fetchData() {
  try {
    let response = await fetch(
      "https://livetiming.formula1.com/static/2023/2023-10-22_United_States_Grand_Prix/2023-10-22_Race/Position.z.json"
    );
    let dataString = await response.text(); // Since it's a string, use the .text() method
    const decoded = Buffer.from(dataString, "base64");
    zlib.inflateRaw(decoded, (err, buffer) => {
      if (err) {
        console.error("Failed to decompress:", err);
      } else {
        iteration++;
        fs.writeFile(
          "./savedData/" + folderName + "/" + iteration + ".json",
          buffer.toString(),
          (err) => {
            if (err) {
              console.error(err);
            }
          }
        );
        console.log("./savedData/" + folderName + "/" + iteration + ".json");
      }
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

setInterval(fetchData, 1000);
