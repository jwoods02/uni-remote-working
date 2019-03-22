const express = require("express");
const bodyParser = require("body-parser");
const stripe = require("stripe")("sk_test_ik5ZUTExOZD1iCpd9Iey4bXy");
const app = express();
const port = 4000;
const schedule = require("node-schedule");
const fetch = require("node-fetch");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const clientId =
  "e40f1e718008dcd3035e17f78ad7357d0d68f3c7057b96f6de6e79b7e50cb34b";
const clientSecret =
  "d85630f1e3a7c4d80f562f056defb2105c86d91c9192af78957866eb5dc76ecc";

let lockAccessToken =
  "10e9dbf60ca73a56643c1e6c447af5b6253abfb5751073ee5d928c597f276b69";
let lockRefreshToken =
  "b80430d1dfe7712e7a1b753444fdb121a2fe8e59743c7cbb8c0feaaf8da2099a";

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

const generateToken = () => {};

const refreshToken = () => {
  fetch("https://smartconnectuk.devicewebmanager.com/oauth/token", {
    method: "post",
    body:
      "grant_type=refresh_token" +
      "&client_id=" +
      clientId +
      "&client_secret=" +
      clientSecret +
      "&refresh_token=" +
      lockRefreshToken,
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

const schRefreshToken = schedule.scheduleJob("*/119 * * * * ", () => {
  refreshToken();
});

const checkStatus = res => {
  if (res.status >= 200 && res.status < 300) {
    return res;
  } else if (res.status === 401) {
    refreshToken();
  } else {
    return null;
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

    const grantLockAccess = fetch(
      "https://api.remotelock.com/access_persons/" + id + "/accesses",
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

  const createGuest = fetch("https://api.remotelock.com/access_persons", {
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
