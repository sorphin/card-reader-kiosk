require("dotenv").config();

const mqtt = require("mqtt");
const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");

const port = new SerialPort(process.env.comPort, {
  baudRate: parseInt(process.env.baudRate, 10),
  autoOpen: false
});

const client = mqtt
  .connect(process.env.borkerURL, { protocolId: "MQIsdp", protocolVersion: 3 })
  .on("error", error => console.log(error))
  .on("message", (topic, message) => console.log(`[${topic}] ${message.toString()}`))
  .on("connect", () => {
    client.publish("reader/info", ">>> MQTT Connected <<<");

    port
      .on("open", () => client.publish("reader/info", ">>> Serial Connected <<<"))
      .pipe(new Readline({ delimiter: "\r\n" }))
      .on("data", data => client.publish("reader/card", data));

    port.open(console.error);
  })
  .subscribe("reader/#");
