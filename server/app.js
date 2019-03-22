const express = require("express");
const bodyParser = require("body-parser");
const stripe = require("stripe")("sk_test_ik5ZUTExOZD1iCpd9Iey4bXy");
const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/api/pay/token", function(req, res) {
  console.log(req.body.token);
  res.send(req.body.token);
});

app.post("/api/pay/customer", async function(req, res) {
  console.log(req.body);
  const customer = await stripe.customers.create({
    email: req.body.email,
    source: req.body.token
  });
  res.send(customer);
});

app.post("/api/pay/subscription", async function(req, res) {
  console.log(req.body);

  const subscription = await stripe.subscriptions
    .create({
      customer: req.body.customer,
      items: [
        {
          plan: "plan_EZ1HJglPYy02ck"
        },
        {
          plan: "plan_EkGpxQ1xXOelsh"
        }
      ]
    })
    .catch(err => {
      console.log(err);
    });

  res.send(subscription);
});

app.post("/api/pay/usage", async function(req, res) {
  console.log(req.body);

  const customer = await stripe.customers.retrieve(req.body.customer);

  const plan = customer.subscriptions.data[0].items.data.find(
    item => item.plan.id == "plan_EkGpxQ1xXOelsh"
  );

  await stripe.usageRecords.create(plan.id, {
    quantity: req.body.minutes,
    timestamp: Math.round(+new Date() / 1000)
  });

  res.send(customer);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
