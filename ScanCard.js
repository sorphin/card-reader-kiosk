require("dotenv").config();

const program = require("commander")
  .version("0.1")
  .option("-c, --code <code>")
  .parse(process.argv);

const client = require("mqtt")
  .connect(process.env.borkerURL, { protocolId: "MQIsdp", protocolVersion: 3 })
  .on("error", error => console.log(error))
  .on("message", (topic, message) => console.log(`[${topic}] ${message.toString()}`))
  .on("connect", () =>
    client
      .publish(
        "reader/card",
        JSON.stringify({
          BitCount: 35,
          CardType: "Test Card",
          FacilityCode: 999,
          CardCode: program.code || 123456789
        })
      )
      .end()
  )
  .subscribe("reader/#");
