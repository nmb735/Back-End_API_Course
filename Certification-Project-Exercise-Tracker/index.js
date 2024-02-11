const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connection to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema Definitions
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
});

const exerciseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Models
const User = mongoose.model("User", userSchema);
const Exercise = mongoose.model("Exercise", exerciseSchema);

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Main API functionalities
// 1 - POST user
app.post("/api/users", function (req, res) {
  // Obtain username from form
  var newUser = new User({
    username: req.body.username,
  });
  newUser.save(function (err, data) {
    if (err) {
      console.error(err);
    } else {
      res.json({ username: data.username, _id: data._id });
    }
  });
});

//2 - GET user list
app.get("/api/users", function (req, res) {
  //Output List
  var userList = [];

  //Find all users. Handle error, or generate output list.
  User.find({}, function (err, data) {
    if (err) {
      console.error(err);
    } else {
      data.forEach(function (user) {
        userList.push({
          username: user.username,
          _id: user._id,
        });
      });
      res.json(userList);
    }
  });
});

// 3 - POST exercise
app.post("/api/users/:_id/exercises", function (req, res) {
  // Find user with ID
  User.findById(req.params._id, function (err, usr) {
    if (err) {
      console.error(err);
      return res.json({ error: "Error finding user" });
    }
    if (!usr) {
      return res.json({ error: "User not found" });
    }

    // Determine date
    let date = req.body.date ? new Date(req.body.date) : new Date();

    // Create exercise
    const newExercise = new Exercise({
      userId: req.params._id,
      description: req.body.description,
      duration: req.body.duration,
      date: date,
    });

    // Save exercise
    newExercise.save(function (err, data) {
      if (err) {
        console.error(err);
        return res.json({ error: "Error saving exercise" });
      }

      // Construct the response
      const response = {
        username: usr.username,
        description: newExercise.description,
        duration: newExercise.duration,
        date: newExercise.date.toDateString(),
        _id: usr._id,
      };

      res.json(response);
    });
  });
});

// 4 - GET exercise log
app.get("/api/users/:_id/logs", function (req, res) {
  // Find the user through the ID
  User.findById(req.params._id, function (err, user) {
    if (err) {
      return res.json({ error: "Error finding user" });
    }
    if (!user) {
      return res.json({ error: "User not found" });
    }

    // Define Query Parameters
    var query = { userId: req.params._id };

    // Optional query parameters
    if (req.query.from) query.date = { $gte: req.query.from };
    if (req.query.to) query.date = { ...query.date, $lte: req.query.to };
    var limit = req.query.limit ? parseInt(req.query.limit) : null;

    // Find the exercises
    Exercise.find(query)
      .limit(limit)
      .exec(function (err, data) {
        if (err) return res.json({ error: "Error finding exercises" });
        if (!data) return res.json({ error: "No exercises found" });

        //Construct the response
        const response = {
          username: user.username,
          _id: user._id,
          count: data.length, // Count of exercises
          log: data.map(function (exercise) {
            return {
              description: exercise.description,
              duration: exercise.duration,
              date: exercise.date.toDateString(), // Format date as string
            };
          }),
        };
        res.json(response);
      });
  });
});

// Listener
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
