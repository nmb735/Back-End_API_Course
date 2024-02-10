var express = require("express");
var cors = require("cors");
require("dotenv").config();
var mongoose = require("mongoose");
var multer = require("multer");

var app = express();
const upload = multer();

// Middleware
app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connection to DB
mongoose.connect(process.env["MONGO_URI"], {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

//Main API function. Action in form is /api/fileanalyse, and file is 'upfile'
app.post('/api/fileanalyse', upload.single('upfile'), function(req, res){
    const fileName = req.file.originalname;
    const fileType = req.file.mimetype;
    const fileSize = req.file.size;
    res.json({ name: fileName, type: fileType, size: fileSize });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
