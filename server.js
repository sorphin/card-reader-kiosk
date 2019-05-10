require("dotenv").config();

const _ = require("lodash");
const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const next = require("next");
const mqtt = require("mqtt");
const mongoose = require("mongoose");
const moment = require("moment");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

const socketIO_connected = socket => `Socket.io connected [${socket.id}]`;
const socketIO_disconnected = socket => `Socket.io disconnected [${socket.id}]`;

const Account = require("./model/Account");
const User = require("./model/User");

// socket.io server
io.on("connection", socket => {
  console.log(socketIO_connected(socket));
  socket.on("disconnect", reason => console.log(socketIO_disconnected(socket)));
});

io.of("/reader").on("connection", socket => {
  console.log(socketIO_connected(socket));
  socket.on("disconnect", reason => console.log(socketIO_disconnected(socket)));

  var client = mqtt
    .connect(process.env.borkerURL, { protocolId: "MQIsdp", protocolVersion: 3 })
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
    .on("connect", () => {
      console.log("Connected to MQTT");
      socket.emit("mqttConnected");
    })
    .on("close", () => console.log("Disconnectd from MQTT"))
    .subscribe("reader/#");

  socket.on("disconnect", reason => client.end());
});

io.of("/db").on("connection", socket => {
  console.log(socketIO_connected(socket));
  socket.on("disconnect", reason => console.log(socketIO_disconnected(socket)));

  mongoose.Promise = global.Promise;
  mongoose
    .connect(process.env.dbURL, { useMongoClient: true })
    .then(db => {
      console.log("Connected to MongoDB");

      socket
        .on("disconnect", reason =>
          db
            .close(true)
            .then(() => console.log("Disconnected from MongDB"))
            .catch(err => console.log("db close", err))
        )
        .on("getAccount", (card, cb) => {
          console.log("getAccount()", { card });

          const { FacilityCode, CardCode } = card;

          Account.findOne({ id: `${FacilityCode}:${CardCode}` })
            .then(account => account && Object.assign(account, { checkins: account.checkins.slice(-1) }))
            .then(account => {
              console.log({ account });
              cb && cb(account);
            })
            .catch(err => {
              console.error(err);
              cb && cb(null);
            });
        })
        .on("checkin", (account, cb) => {
          console.log("checkin()", { account });

          var { _id } = account;

          Account.findById(_id)
            .then(account => {
              account.checkins.push({ nNumber: account.nNumber });
              account
                .save()
                .then(() => account.checkins.slice(-1).reduce((a, c) => c, {}))
                .then(checkin => console.log({ checkin }) || (cb && cb(checkin)))
                .catch(err => console.error(err) || (cb && cb(null)));
            })
            .catch(err => console.error(err) || (cb && cb(null)));
        })
        .on("createAccount", (name, nNumber, email, card, cb) => {
          console.log("createAccount()", { name, nNumber, email, card });

          const { FacilityCode, CardCode } = card;

          if (FacilityCode > 0 && CardCode > 0) {
            if (name && nNumber) {
              Account.create({
                id: `${FacilityCode}:${CardCode}`,
                name,
                nNumber,
                email
              })
                .then(account => {
                  console.log({ account });
                  cb && cb(account);
                })
                .catch(err => {
                  console.error(err);
                  cb && cb(null);
                });
            } else {
              console.error(new Error("need both a name and n-number"));
              cb && cb(null);
            }
          } else {
            console.error(new Error("bad card data"));
            cb && cb(null);
          }
        })
        .on("dumpData", (start, end, cb) => {
          console.log("dumpData()");

          const headers = { name: "Name", nNumber: "N-Number", checkins: "Last-Check-In" };
          const today = moment().startOf("day");
          const tomorrow = moment()
            .startOf("day")
            .add(1, "days");

          Account.find()
            .then(accounts =>
              accounts
                .filter(account => account.checkins.length > 0)
                .map(account => ({ name: account.name, nNumber: account.nNumber, checkins: account.checkins.slice(-1)[0].created }))
                .filter(account => moment(account.checkins).isSameOrAfter(start || today) && moment(account.checkins).isBefore(end || tomorrow, "day"))
            )
            .then(accounts => [headers, ...accounts].reduce((a, c) => [...a, [c.name, c.nNumber, c.checkins]], []))
            .then(accounts => cb && cb(accounts))
            .catch(err => {
              console.error(err);
              cb && cb(null);
            });
        })
        .on("getUsers", (text, cb) => {
          User.find({ $or: ["number", "name"].map(f => ({ [f]: { $regex: text, $options: "i" } })) })
            .lean()
            .limit(10)
            .then(users => cb && cb(_.uniqBy(users, "number")))
            .catch(err => {
              console.error(err);
              cb && cb(null);
            });
        });

      socket.emit("mongoConnected");
    })
    .catch(err => {
      console.error(err);
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
  .catch(error => {
    console.error(error);
  });
