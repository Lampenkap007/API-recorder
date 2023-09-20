var express = require("express");
var fs = require("fs");
var app = express();

const folderName = "Recording1";
let iteration = 1;
let jsonData;

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

setInterval(() => {
  fs.readFile(
    "./" + folderName + "/" + iteration + ".json",
    "utf8",
    function (err, data) {
      if (err) throw err;
      jsonData = JSON.parse(data);
    }
  );
  iteration = iteration + 1;
}, 1000);

app.get("/data", (req, res, next) => {
  res.json(jsonData);
});
