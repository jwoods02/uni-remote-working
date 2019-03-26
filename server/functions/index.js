const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
// https://smartconnectuk.devicewebmanager.com/oauth/authorize?client_id=86b38dbd471070664803a23c824d104e4cf97b95b1a0ffface3939cc94963c65&response_type=code&redirect_uri=https://remoteruralworking.firebaseapp.com/api/lock/oauth_callback

const express = require("express");
const bodyParser = require("body-parser");
const stripe = require("stripe")("sk_test_ik5ZUTExOZD1iCpd9Iey4bXy");
const app = express();
const schedule = require("node-schedule");
const axios = require("axios");
const firebase = require("firebase");

firebase.initializeApp({
  apiKey: "AIzaSyB3eOEQaPomF624RwDBl3bmO97guiN-TRs",
  authDomain: "remoteruralworking.firebaseapp.com",
  databaseURL: "https://remoteruralworking.firebaseio.com",
  projectId: "remoteruralworking",
  storageBucket: "remoteruralworking.appspot.com",
  messagingSenderId: "397948314964"
});

const { URLSearchParams } = require("url");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const clientId =
  "86b38dbd471070664803a23c824d104e4cf97b95b1a0ffface3939cc94963c65";
const clientSecret =
  "6776912819a6ebf0d7d18bf3a5a97c7eebe0b544798a07e3d8f4e0fcae36a277";

const lockCallbackUrl =
  "https://remoteruralworking.firebaseapp.com/api/lock/oauth_callback";
let lockAccessToken;
let lockRefreshToken;
let userJsonReq;
let userReq;
const systemReq = axios.create({
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  }
});

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

const setAccess = data => {

  console.log("Authorisation: " + data);
  lockRefreshToken = data.refresh_token;

  userJsonReq = axios.create({
    headers: {
      Accept: "application/vnd.lockstate+json; version=1",
      "Content-Type": "application/json",
      Authorization: "Bearer " + data.access_token
    }
  });

  userReq = axios.create({
    headers: {
      Accept: "application/vnd.lockstate+json; version=1",
      Authorization: "Bearer " + data.access_token
    }
  });
};

const refreshToken = async () => {
  try {
    const params = new URLSearchParams();
    params.append("refresh_token", lockRefreshToken);
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);
    params.append("grant_type", "refresh_token");

    // https://github.com/axios/axios/issues/1891
    const auth = await systemReq.post(
      `https://smartconnectuk.devicewebmanager.com/oauth/token?${params.toString()}`
    );

    setAccess(auth.data);
  } catch (error) {
    console.log(error);
  }
};

const deleteLockUser = lockUser => {
  return userReq.delete(
    "https://api.remotelock.com/access_persons/" + lockUser
  );
};

const errorStatus = status => {
  switch (status) {
    case 401: refreshToken();
      break;
    case 402: //pin already exists
      break;
    default: break;
  }
};

app.get("/api/lock/oauth_callback", async function(req, res) {
  try {
    const params = new URLSearchParams();
    params.append("code", req.query.code);
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);
    params.append("redirect_uri", lockCallbackUrl);
    params.append("grant_type", "authorization_code");

    // https://github.com/axios/axios/issues/1891
    const auth = await systemReq.post(
      `https://smartconnectuk.devicewebmanager.com/oauth/token?${params.toString()}`
    );

    setAccess(auth.data);

    schedule.scheduleJob("*/118 * * * *", () => {
      refreshToken();
    });

    res.status(200).send(req.query);
  } catch (error) {
    if (error.response) {
      errorStatus(error.response.status);
    }
    console.log(error);
    res.status(500).send(error);
  }
});

app.post("/api/lock/guest", async function(req, res) {
  try {
    const response = await userJsonReq.post(
      "https://api.remotelock.com/access_persons",
      {
        type: "access_guest",
        attributes: {
          starts_at: new Date(),
          ends_at: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
          name: req.body.user,
          pin: req.body.pin
        }
      }
    );

    const data = response.data.data;

    userJsonReq.post(
      "https://api.remotelock.com/access_persons/" + data.id + "/accesses",
      {
        attributes: {
          accessible_id: "28992f53-7f92-4101-b1b5-1bf1fca693dc",
          accessible_type: "lock"
        }
      }
    );

    res.status(200).send(data);
  } catch (error) {
    if (error.response) {
      errorStatus(error.response.status);
    }
    console.log(error);
    res.status(500).send(error);
  }
});

app.delete("/api/lock/guest/:lockUser", async function(req, res) {
  try {
    const response = await deleteLockUser(req.params.lockUser);

    res.status(204).send();
  } catch (error) {
    if (error.response) {
      errorStatus(error.response.status);
    }
    console.log(error);
    res.status(500).send(error);
  }
});

app.post("/api/lock/session", async function(req, res) {
  try {
    const lockUser = req.body.data.attributes.associated_resource_id;

    const snapshot = await firebase
      .firestore()
      .collection("sessions")
      .where("lockUser", "==", lockUser)
      .get();
    snapshot.docs[0].ref.update({ start: new Date() });

    const response = await deleteLockUser(lockUser);

    res.status(200).send(response);
  } catch (error) {
    if (error.response) {
      errorStatus(error.response.status);
    }
    console.log(error);
    res.status(500).send(error);
  }
});

exports.api = functions.https.onRequest(app);
