require("dotenv").config();

const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const next = require("next");
const mqtt = require("mqtt");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

// socket.io server
io.on("connection", socket => {
  console.log(`Socket connection from [${socket.id}]`);

  var client = mqtt.connect(process.env.borkerURL);

  client
    .on("error", error => console.error(error))
    .on("message", (topic, message) => {
      var card = {};

      try {
        card = JSON.parse(message.toString());
      } catch (err) {
        card = JSON.parse(JSON.stringify(message.toString()));
      }

      socket.emit(topic, card);
    })
    .on("connect", () => console.log("Connected to MQTT"))
    .on("close", () => console.log("Disconnectd from MQTT"))
    .subscribe("reader/#");

  socket.on("disconnect", reason => {
    console.log(`Socket disconnected from [${socket.id}] `);

    client.end();
  });
});

nextApp
  .prepare()
  .then(() => {
    app.get("*", (req, res) => {
      return nextHandler(req, res);
    });

    server.listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch(error => console.error(error));
