const express = require("express");
const bodyParser = require("body-parser");
const stripe = require("stripe")("sk_test_ik5ZUTExOZD1iCpd9Iey4bXy");
const app = express();
const port = 4000;

const schedule = require("node-schedule");
const fetch = require("node-fetch");
const opn = require("opn");

const { URLSearchParams } = require("url");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const clientId =
  "86b38dbd471070664803a23c824d104e4cf97b95b1a0ffface3939cc94963c65";
const clientSecret =
  "6776912819a6ebf0d7d18bf3a5a97c7eebe0b544798a07e3d8f4e0fcae36a277";

const lockCallbackUrl = "https://2037714b.ngrok.io/api/lock/oauth_callback";
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

/////////////////////////////////// LOCK

opn(
  "https://smartconnectuk.devicewebmanager.com/oauth/authorize?client_id=" +
    clientId +
    "&response_type=code" +
    "&redirect_uri=" +
    lockCallbackUrl
);

const refreshToken = () => {
  const params = new URLSearchParams();
  params.append("refresh_token", lockRefreshToken);
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("grant_type", "refresh_token");

  fetch("https://smartconnectuk.devicewebmanager.com/oauth/token", {
    method: "post",
    body: params,
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  })
    .then(checkStatus)
    .then(res => res.json())
    .then(json => {
      console.log(json);
      lockAccessToken = json.access_token;
      lockRefreshToken = json.refresh_token;
    })
    .catch(err => console.error(err));
};

const checkStatus = res => {
  if (res.status >= 200 && res.status < 300) {
    return res;
  } else if (res.status === 401) {
    // Invalid auth
    refreshToken();
    throw "Error";
  } else if (res.status === 402) {
    // Pin already exists
    throw "Error: " + res.statusText;
  } else {
    throw "Error: " + res.statusText;
  }
};

app.get("/api/lock/oauth_callback", function(req, res) {
  console.log(req.query);
  res.send(req.query);

  const params = new URLSearchParams();
  params.append("code", req.query.code);
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("redirect_uri", lockCallbackUrl);
  params.append("grant_type", "authorization_code");

  fetch("https://smartconnectuk.devicewebmanager.com/oauth/token", {
    method: "post",
    body: params,
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  })
    .then(checkStatus)
    .then(res => res.json())
    .then(json => {
      console.log(json);
      lockAccessToken = json.access_token;
      lockRefreshToken = json.refresh_token;
    })
    .then(() =>
      schedule.scheduleJob("*/118 * * * *", () => {
        refreshToken();
      })
    )
    .catch(err => console.error(err));
});

app.post("/api/lock/guest", function(req, res) {
  console.log(req.body);

  const guestAccessLock = data => {
    const body = {
      attributes: {
        accessible_id: "28992f53-7f92-4101-b1b5-1bf1fca693dc",
        accessible_type: "lock"
      }
    };

    return fetch(
      "https://api.remotelock.com/access_persons/" + data.id + "/accesses",
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
      .then(checkStatus)
      .then(res => res.json())
      .then(json => console.log(json))
      .then(() => data);
  };

  const body = {
    type: "access_guest",
    attributes: {
      starts_at: new Date(),
      ends_at: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
      name: req.body.user,
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
    .then(json => guestAccessLock(json.data))
    .then(data => res.status(200).json(data))
    .catch(err => {
      console.error(err);
      res.status(500).send("Server error");
    });
});

app.delete("/api/lock/guest/:lockUserId", function(req, res) {
  fetch("https://api.remotelock.com/access_persons/" + req.params.lockUserId, {
    method: "delete",
    headers: {
      Accept: "application/vnd.lockstate+json; version=1",
      Authorization: "Bearer " + lockAccessToken
    }
  })
    .then(checkStatus)
    .then(() => res.status(204).send())
    .catch(err => {
      console.error(err);
      res.status(500).send("Server error");
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
