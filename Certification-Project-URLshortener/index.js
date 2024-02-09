require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const validUrl = require("valid-url");
const shortid = require("shortid");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

// Storage for original_url and short_url mappings
const urlDatabase = {};

//Regular expression to match a valid URL
function isUrlValid(url) {
  const urlRegex =
    /^(https?):\/\/(?:www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+(?:\/[\w-./?%&=]*)?$/;
  return urlRegex.test(url);
}

// Main API function - URL Shortener Microservice (Part I - Post)
app.post('/api/shorturl', function(req, res){
  const originalUrl = req.body.url;

  // Check if URL is provided
  if (!originalUrl) {
    res.json({ error: 'missing url' });
    return;
  }

  // Check if URL is valid
  if (!isUrlValid(originalUrl)) {
    res.json({ error: 'invalid url' });
    return;
  }

  // Generate short_url
  const shortUrl = shortid.generate();
  // Store the URL mapping
  urlDatabase[shortUrl] = originalUrl;
  // Return response
  res.json({ original_url: originalUrl, short_url: shortUrl });
});


// Main API function - URL Shortener Microservice (Part I - Redirect to original URL)
app.get("/api/shorturl/:short_url", function (req, res) {
  const shortUrl = req.params.short_url;

  // Check if short URL exists in database
  if (urlDatabase.hasOwnProperty(shortUrl)) {
    const originalUrl = urlDatabase[shortUrl];
    res.redirect(originalUrl);
  } else {
    res.json({ error: "short url not found" });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
