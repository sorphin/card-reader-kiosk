const readline = require("readline");
const fs = require("fs");
const parse = require("csv-parse");
const mongoose = require("mongoose");
const User = require("./model/User");

mongoose.Promise = global.Promise;

require("dotenv").config();
require("yargs")
  .command(
    "export",
    "Export User Collection.",
    yargs => {},
    argv =>
      mongoose
        .connect(process.env.dbURL, { useMongoClient: true })
        .then(db => {
          User.find()
            .then(data => {
              console.log(data);
            })
            .then(() => {
              db.close();
            })
            .catch(err => console.error(err));
        })
        .catch(err => console.error(err))
  )
  .command(
    "import [file]",
    "Import a CSV file (First Name,Last Name,Email,Number) into the User Collection.",
    yargs => {
      yargs
        .positional("file", {
          describe: "A CSV File to import.",
          type: "string",
        })
        .demandOption("file", "I need a file to import");
    },
    argv =>
      mongoose
        .connect(process.env.dbURL, { useMongoClient: true })
        .then(db => {
          console.log("Connected to MongoDB");
          let columns = null;
          const rl = readline
            .createInterface({
              input: fs.createReadStream(argv.file),
              crlfDelay: Infinity,
            })
            .on("line", line => {
              if (columns == null) {
                columns = line.split(",");
              } else {
                parse(line, { columns }, (err, records) => {
                  if (err) throw err;

                  records
                    .map(record => ({
                      first: record["First Name"],
                      last: record["Last Name"],
                      number: record["Number"],
                      email: record["Email"],
                    }))
                    .map(record =>
                      User.find({ number: new RegExp(record.number, "i") })
                        .then(data => {
                          if (data.length == 0) {
                            User.create({
                              name: `${record.first} ${record.last}`,
                              number: record.number,
                              email: record.email,
                            })
                              .then(user => {
                                console.log(
                                  `${user.name} (${user.number}) added`
                                );
                              })
                              .catch(err => console.error(err));
                          } else {
                            console.log(record.number, "exists");
                          }
                        })
                        .catch(err => console.error(err))
                    );
                });
              }
            })
            .on("error", err => {
              console.error(err);
            })
            .on("close", () => {
              rl.close();
              db.close();
            });
        })
        .catch(err => console.error(err))
  )
  .demandCommand(1, "You need at least one command before moving on")
  .help()
  .parse();
