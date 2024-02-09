// index.js
// where your node app starts

// init project
var express = require("express");
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

// API main function
app.get("/api/:date?", function (req, res) {
  // Get the date parameter from the request
  const dateParam = req.params.date;

  // Check if the date parameter is empty
  if (!dateParam) {
    // If there is no parameter, return the current date
    const currentDate = new Date();
    res.json({ unix: currentDate.getTime(), utc: currentDate.toUTCString() });
  } else {
    // Try to parse the date parameter as a number
    const parsedDate = Number(dateParam);

    // Check if the parsed date is a valid number
    if (!isNaN(parsedDate)) {
      // If it's a valid number (presumed to be milliseconds), create a new Date object
      const date = new Date(parsedDate);
      // Return its Unix timestamp (already in milliseconds) and UTC string representation
      res.json({ unix: parsedDate, utc: date.toUTCString() });
    } else {
      // Try parsing the date parameter as a date string
      const date = new Date(dateParam);

      // Check if the parsed date is valid
      if (!isNaN(date.getTime())) {
        // If it's a valid date, return its Unix timestamp and UTC string representation
        res.json({ unix: date.getTime(), utc: date.toUTCString() });
      } else {
        // If it's not a valid date, return an error
        res.json({ error: "Invalid Date" });
      }
    }
  }
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
