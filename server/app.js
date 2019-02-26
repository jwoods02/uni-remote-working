const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/", function(req, res) {
  res.send("Hello world!");
});

app.post("/api/", function(req, res) {
  console.log(req.body.field1);
  console.log(req.body.field2);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));