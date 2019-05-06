const parse = require("csv-parse");
const fs = require("fs");
const mongoose = require("mongoose");
const Account = require("./model/Account");

require("dotenv").config();
require("yargs")
  .command(
    "import [file]",
    "Import a CSV file into the database.",
    yargs => {
      yargs
        .positional("file", {
          describe: "A CSV File to import.",
          type: "string"
        })
        .demandOption("file", "I need a file to import");
    },
    argv => {
      mongoose.Promise = global.Promise;

      mongoose
        .connect(process.env.dbURL, { useMongoClient: true })
        .then(db => {
          console.log("Connected to MongoDB");

          fs.readFile(argv.file, (err, data) => {
            if (err) throw err;

            parse(data.toString("utf8"), { columns: true }, (err, records) => {
              if (err) throw err;

              Promise.all(
                records
                  .map(record => ({
                    first: record["First Name"],
                    last: record["Last Name"],
                    nNumber: record["EMP#"]
                  }))
                  .map(record =>
                    Account.find({ nNumber: record.nNumber })
                      .then(data => {
                        if (data.length == 0) {
                          
                        } else {
                          console.log(record.nNumber, data);
                        }
                      })
                      .catch(err => console.error(err))
                  )
              )
                .then(() => {
                  db.close();
                })
                .catch(err => console.error(err));
            });
          });
        })
        .catch(err => console.error(err));
    }
  )
  .demandCommand(1, "You need at least one command before moving on")
  .help()
  .parse();
