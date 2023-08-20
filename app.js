// importing modules
require("dotenv").config();
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// declraing default variables
const app = express();
const mongourl = `mongodb+srv://ritkaarsingh30:${process.env.MONGO_PASS}@cluster0.ihobhjk.mongodb.net/dlinks?retryWrites=true&w=majority`;

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//establishing connection with mongodb
const connection = async function () {
  mongoose.connect(mongourl).then(() => {
    console.log("DB connection established");
  });
};
connection().catch((err) => {
  console.error(err + "connection error");
});

//establishing mongoose schema
const dataSchema = mongoose.Schema({
  url: {
    type: String,
    unique: true,
  },
});

//creating model
const Data = mongoose.model("data", dataSchema);

//aws configuration
let accessKey = process.env.ACCESS_KEY;
let secretKey = process.env.ACCESS_SECRET;
aws.config.update({
  secretAccessKey: secretKey,
  accessKeyId: accessKey,
  region: process.env.REGION,
});

const s3client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
});
const BUCKET = process.env.BUCKET;
const s3 = new aws.S3();

//controller functions
async function getObjectURL(accessKeyId) {
  const command = new GetObjectCommand({
    Bucket: "s3-filling",
    Key: accessKeyId,
  });
  const url = await getSignedUrl(s3client, command, { expiresIn: 604800 }); // try catch
  return url;
}

async function init(key) {
  const downloadURL = await getObjectURL(key);
  console.log("URL for sample,", downloadURL);
  return downloadURL;
}

//multer configuration
const upload = multer({
  storage: multerS3({
    s3: s3,
    acl: "public-read",
    bucket: BUCKET,
    key: function (req, file, cb) {
      console.log(file);
      cb(null, file.originalname);
    },
  }),
});

//API methods
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

let downloadURL;
app.post("/", upload.single("file"), async function (req, res, next) {
  console.log(req.file);

  if (req.file.size >= 10000000) {
    console.log("size too big, try again");
    // Handle size too big error
    res.status(400).send("File size too big");
  } else {
    downloadURL = await init(req.file.key);

    //uploading links on mongodb server
    const newData = new Data({
      url: JSON.stringify(downloadURL),
    });

    try {
      await newData.save();
      console.log("Data Saved");

      res.send(
        `<h1>Download</h1><h3><a href="${downloadURL}">Click Here to Download</a></h3>
        <h3>Download Link - <br>${downloadURL}</h3>`
      );
    } catch (err) {
      console.error(err + " New Data error");
      res.status(500).send("Error saving data");
    }
  }
});

app.get("/getlink", async (req, res) => {
  const links = await Data.find().select({ url: 1, _id: 0 });

  const linksStr = links.map((el) => {
    return `URL : ${el.url}<br>`;
  });
  const linksStr2 = linksStr.join("\n<br>");
  res.send(`${linksStr2}`);
});

//starting the server
app.listen(3000, () => {
  console.log("Server Started");
});
