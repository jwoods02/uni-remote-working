const express = require("express");
const bodyParser = require("body-parser");
const stripe = require("stripe")("sk_test_ik5ZUTExOZD1iCpd9Iey4bXy");
const app = express();
const port = 4000;
const lockAccessToken = "cc16e53b389f06cfd7d81ec814f96f472d96cf14a23510091a708fea05479c39";
const lockRefreshToken = "60950336468bda2abf4f72c0be97e223577df9bfaa25c39e86d69769d80bc6b9";

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

app.post("/api/pay/subscription", async function (req, res) {
  console.log(req.body);

  const subscription = await stripe.subscriptions
    .create({
      customer: req.body.customer,
      items: [
        {
          plan: "plan_EZ1HJglPYy02ck"
        }
      ]
    })
    .catch(err => {
      console.log(err);
    });

  res.send(subscription);
});




app.post("/api/lock/guest", async function (req, res) {

  console.log(req.body);
  const date = new Date();


  checkStatus = res => {
    if (res.status >= 200 && res.status < 300) {
      return res;
    } else if (res.status === 401) {

    const renewToken = await fetch('https://smartconnectuk.devicewebmanager.com/oauth/token', {
        method: 'post',
        body: 'grant_type=refresh_token client_id=e40f1e718008dcd3035e17f78ad7357d0d68f3c7057b96f6de6e79b7e50cb34b' + 
        'client_secret=d85630f1e3a7c4d80f562f056defb2105c86d91c9192af78957866eb5dc76ecc refresh_token=' + lockRefreshToken ,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
        .then(res => res.json())
        // .then(json => 
          
        //   // lockAccessToken = json.access_token;
        //   // lockRefreshToken = json.refresh_token;
          
        //   );

    } else {
      throw MyCustomError(res.statusText);
    }
  }

  const body = {
    type: "access_guest",
    attributes: {
      starts_at: new Date(),
      ends_at: date.setDate(date.getDate() + 1),
      name: req.user,
      pin: req.pin
    }
  };

  const createGuest = await fetch('https://api.remotelock.com/access_persons', {
    method: 'post',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.lockstate+json; version=1',
      'Authorization': 'Bearer ' + lockAccessToken
    },
  })
    .then(checkStatus)
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.error(err));



});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
