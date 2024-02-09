let express = require("express");
let app = express();
let bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

var staticPath = __dirname + "/public";

app.use("/public", express.static(staticPath));

app.use(function (req, res, next) {
  var ip = req.ip;
  var method = req.method;
  var path = req.path;
  console.log(method + " " + path + " - " + ip);
  next();
});

app.get(
  "/now",
  function (req, res, next) {
    req.time = new Date().toString();
    next();
  },
  function (req, res) {
    res.json({ time: req.time });
  },
);

app.get("/", function (req, res) {
  var absolutePathe = __dirname + "/views/index.html";
  res.sendFile(absolutePathe);
});

app.get("/json", function (req, res) {
  if (process.env.MESSAGE_STYLE === "uppercase")
    res.json({ message: "HELLO JSON" });
  else res.json({ message: "Hello json" });
});

app.get("/:word/echo", function (req, res) {
  res.json({ echo: req.params.word });
});

app
  .route("/name")
  .get(function (req, res) {
    res.json({ name: req.query.first + " " + req.query.last });
  })
  .post(function (req, res) {
    res.json({ name: req.body.first + " " + req.body.last });
  });

module.exports = app;
