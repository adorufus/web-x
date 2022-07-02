
require("./config/config");
require("./models/db");
require("./middlewares/passport");

const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const routers = require("./routes/index");
const cors = require("cors");
const app = express();
const http = require("http");
const https = require("https");
const PORT = 8080;
const { initializeApp, cert } = require("firebase-admin/app");
const serviceAccount = require("../service.json");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: "webx-cloud-image",
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "webx-1500b.appspot.com",
});

var allowedOrigins = ["http://localhost:4200", "https://artemizpro.com"];

app.use(
  cors({
    origin: "https://artemizpro.com",
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"]
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

app.get("/", (req, res, nxt) => {
  res.status(403).json({
    status: "forbidden",
    message: "You're not supposed to be here, please go away",
  });
  nxt();
});

app.use("/api/v1", [routers.authRoute, routers.bannerRoute, routers.newsRoute]);

const options = {
  ca: fs.readFileSync("ca_bundle.crt"),
  key: fs.readFileSync("private.key"),
  cert: fs.readFileSync("certificate.crt"),
};

// app.listen(PORT, () => {
//   console.log("app running in port: " + PORT);
// });

// http.createServer(app).listen(8000);
https.createServer(options, app).listen(8080);
