const axios = require("axios");
const WebSocket = require("ws");
const fs = require("fs");
const url = require("url");

const FORMULA_1_NEGOTIATE_PATH =
  "https://livetiming.formula1.com/signalr/negotiate";
const FORMULA_1_CONNECT_PATH = "wss://livetiming.formula1.com/signalr/connect";
const FORMULA_1_CONNECTION_DATA = '[{"name":"Streaming"}]';
const FORMULA_1_SUBSCRIPTIONS = `{"H":"Streaming","M":"Subscribe","A":[["SPFeed","TimingStats","SessionInfo","SessionData","DriverList","LapCount","TimingData", "TimingAppData"]],"I":1}`;

let iteration = 0;
const folderName = "Trololo";

try {
  if (!fs.existsSync("./savedData/" + folderName)) {
    fs.mkdirSync("./savedData/" + folderName);
  }
} catch (err) {
  console.error(err);
}

axios
  .get(FORMULA_1_NEGOTIATE_PATH, {
    params: {
      connectionData: '[{"name":"Streaming"}]',
      clientProtocol: "1.5",
    },
  })
  .then(function (negotiateData) {
    const queryParams = new url.URLSearchParams({
      transport: "webSockets",
      connectionData: FORMULA_1_CONNECTION_DATA,
      connectionToken: negotiateData.data.ConnectionToken,
      clientProtocol: "1.5",
    });

    const connectUrl = FORMULA_1_CONNECT_PATH + "?" + queryParams.toString();

    const headers = {
      Cookie: negotiateData.headers["set-cookie"],
    };

    const ws = new WebSocket(connectUrl, {
      headers: headers,
    });

    function sendMessage() {
      ws.send(FORMULA_1_SUBSCRIPTIONS);
    }

    ws.on("open", () => {
      console.log("Connected to the server");
      // setInterval(() => sendMessage(), 1000);
      sendMessage();
    });

    ws.on("error", (err) => {
      console.error("Failed to connect:", err);
    });

    ws.on("message", (message) => {
      let decodedMessage = Buffer.from(message, "base64").toString("ascii");
      if (decodedMessage != "{}") {
        iteration = iteration + 1;
        console.log("./savedData/" + folderName + "/" + iteration + ".json");
        fs.writeFile(
          "./savedData/" + folderName + "/" + iteration + ".json",
          JSON.stringify(decodedMessage),
          (err) => {
            if (err) {
              console.error(err);
            }
          }
        );
      }
    });
  });
