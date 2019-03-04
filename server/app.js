const express = require("express");
const bodyParser = require("body-parser");
const stripe = require("stripe")("sk_test_ik5ZUTExOZD1iCpd9Iey4bXy");
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

app.post("/api/pay/token", function(req, res) {
  console.log(req.body.token);
  res.send(req.body.token);
});

app.post("/api/pay/customer", function(req, res) {
  console.log(req.body);
  const customer = stripe.customers.create({
    email: req.body.email,
    source: req.body.token
  });
  res.send(customer);
});

app.post("/api/pay/subscription", function(req, res) {
  console.log(req.body.token);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
