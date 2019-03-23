const express = require("express");
const bodyParser = require("body-parser");
const stripe = require("stripe")("sk_test_ik5ZUTExOZD1iCpd9Iey4bXy");
const app = express();
const port = 4000;
const schedule = require("node-schedule");
const fetch = require("node-fetch");
const opn = require('opn');

const { URLSearchParams } = require('url');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const clientId =
  "86b38dbd471070664803a23c824d104e4cf97b95b1a0ffface3939cc94963c65";
const clientSecret =
  "6776912819a6ebf0d7d18bf3a5a97c7eebe0b544798a07e3d8f4e0fcae36a277";

const lockCallbackUrl = "https://d8588e05.ngrok.io/api/lock/oauth_callback";
let lockAccessToken;
let lockRefreshToken;


/////////////////////////////////// STRIPE

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
        }
      ]
    })
    .catch(err => {
      console.log(err);
    });

  res.send(subscription);
});

/////////////////////////////////// LOCK



opn('https://smartconnectuk.devicewebmanager.com/oauth/authorize?client_id=' +
    clientId +
    '&response_type=code' +
    '&redirect_uri=' +
    lockCallbackUrl);


app.get('/api/lock/oauth_callback', function (req, res) {

  console.log(req.query);
  res.send(req.query);

  const params = new URLSearchParams();
  params.append('code', req.query.code);
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('redirect_uri', lockCallbackUrl);
  params.append('grant_type', 'authorization_code');

  fetch('https://smartconnectuk.devicewebmanager.com/oauth/token', {
    method: 'post',
    body: params,
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  })
    .then(res => res.json())
    .then(json => {
      console.log(json);
      lockAccessToken = json.access_token;
      lockRefreshToken = json.refresh_token;
    }).then(() => schedule.scheduleJob('*/118 * * * * ', () => { refreshToken() }))
    .catch(err => console.log(err));

});




const refreshToken = () => {

  const params = new URLSearchParams();
  params.append('refresh_token', lockRefreshToken);
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('grant_type', 'refresh_token');

  fetch("https://smartconnectuk.devicewebmanager.com/oauth/token", {
    method: "post",
    body: params,
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  })
    .then(res => res.json())
    .then(json => {
      console.log(json);
      lockAccessToken = json.access_token;
      lockRefreshToken = json.refresh_token;
    })
    .catch(err => console.log(err));
};



const checkStatus = res => {
  if (res.status >= 200 && res.status < 300) {
    return res;
  } else if (res.status === 401) {
    refreshToken();
    // res.send(500, "Please try again!")
    throw "Error!"
  } else {
    throw "Error!";
  }
};

app.post("/api/lock/guest", async function(req, res) {
  console.log(req.body);

  const guestAccessLock = id => {
    const body = {
      attributes: {
        accessible_id: "28992f53-7f92-4101-b1b5-1bf1fca693dc",
        accessible_type: "lock"
      }
    };

    fetch("https://api.remotelock.com/access_persons/" + id + "/accesses",
      {
        method: "post",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/vnd.lockstate+json; version=1",
          Authorization: "Bearer " + lockAccessToken
        }
      }
    )
      .then(res => res.json())
      .then(json => {
        console.log(json);
      })
      .catch(err => console.error(err));
  };

  const body = {
    type: "access_guest",
    attributes: {
      starts_at: new Date(),
      ends_at: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
      name: req.body.name,
      pin: req.body.pin
    }
  };

  fetch("https://api.remotelock.com/access_persons", {
    method: "post",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/vnd.lockstate+json; version=1",
      Authorization: "Bearer " + lockAccessToken
    }
  })
    .then(checkStatus)
    .then(res => res.json())
    .then(json => {
      guestAccessLock(json.data.id);
      return json.data.id;
    })
    .then(id => res.send(200, id))
    .catch(err => {
      console.error(err);
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
