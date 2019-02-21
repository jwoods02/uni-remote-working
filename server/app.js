const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/", function(req, res) {
  res.send("Hello world!");
});

app.post("/api/", function(req, res) {
  res.send("Hello world!");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
