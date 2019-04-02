const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
// https://smartconnectuk.devicewebmanager.com/oauth/authorize?client_id=86b38dbd471070664803a23c824d104e4cf97b95b1a0ffface3939cc94963c65&response_type=code&redirect_uri=https://remoteruralworking.firebaseapp.com/api/lock/oauth_callback

const express = require("express");
const bodyParser = require("body-parser");
const stripe = require("stripe")("sk_test_ik5ZUTExOZD1iCpd9Iey4bXy");
const app = express();
const axios = require("axios");
const firebase = require("firebase");
const cors = require('cors');

app.use(cors());


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

/////////////////////////////////// STRIPE

const getSubscriptionPrice = async function(customer) {
  console.log("Customer subs", customer.subscriptions.data);
  const item = await customer.subscriptions.data[0].items.data.find(
    item => item.plan.id == "plan_EZ1HJglPYy02ck"
  );
  return item.plan.amount;
};

const getUsagePrice = async function(customer) {
  const item = await customer.subscriptions.data[0].items.data.find(
    item => item.plan.id == "plan_EkGpxQ1xXOelsh"
  );
  return item.plan.amount;
};

app.post("/api/pay/token", function(req, res) {
  console.log(req.body.token);
  res.status(200).send(req.body.token);
});

app.post("/api/pay/customer", async function(req, res) {
  console.log(req.body);
  const customer = await stripe.customers.create({
    email: req.body.email,
    source: req.body.token
  });
  res.status(200).send(customer);
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

  const customer = await stripe.customers.retrieve(req.body.customer);
  const price = await getSubscriptionPrice(customer);

  res.status(200).send({ price });
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

  const unit_price = await getUsagePrice(customer);
  const price = unit_price * req.body.minutes;

  res.status(200).send({ price });
});

/////////////////////////////////// LOCK

const setTokens = async data => {
  lockAccessToken = data.access_token;

  console.log(`ACCESS TOKEN: ${lockAccessToken}`);

  await firebase
    .firestore()
    .collection("lock_tokens")
    .doc("refresh_token")
    .set({
      value: data.refresh_token,
      created: new Date()
    });
};

const updateTokens = async () => {
  try {
    const ref = await firebase
      .firestore()
      .collection("lock_tokens")
      .doc("refresh_token")
      .get();

    const refreshToken = ref.data().value;

    const params = new URLSearchParams();
    params.append("refresh_token", refreshToken);
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);
    params.append("grant_type", "refresh_token");

    // https://github.com/axios/axios/issues/1891
    const response = await axios.post(
      `https://smartconnectuk.devicewebmanager.com/oauth/token?${params.toString()}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    await setTokens(response.data);

    return response.data.access_token;
  } catch (error) {
    console.log(error);
  }
};

axios.interceptors.response.use(null, async error => {
  if (error.config && error.response && error.response.status === 401) {
    console.log("Invalid token! Updating...");

    const accessToken = await updateTokens();
    error.config.headers["Authorization"] = "Bearer " + accessToken;

    return axios.request(error.config);
  }
  return Promise.reject(error);
});

const deleteLockUser = lockUser => {
  return axios.delete("https://api.remotelock.com/access_persons/" + lockUser, {
    headers: {
      Accept: "application/vnd.lockstate+json; version=1",
      Authorization: "Bearer " + lockAccessToken
    }
  });
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
    const response = await axios.post(
      `https://smartconnectuk.devicewebmanager.com/oauth/token?${params.toString()}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    await setTokens(response.data);

    res.status(200).send(req.query);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error!");
  }
});

app.post("/api/lock/guest", async function(req, res) {
  try {
    const response = await axios.post(
      "https://api.remotelock.com/access_persons",
      {
        type: "access_guest",
        attributes: {
          starts_at: new Date(),
          ends_at: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
          name: req.body.user,
          pin: req.body.pin
        }
      },
      {
        headers: {
          Accept: "application/vnd.lockstate+json; version=1",
          "Content-Type": "application/json",
          Authorization: "Bearer " + lockAccessToken
        }
      }
    );

    const data = response.data.data;

    axios.post(
      "https://api.remotelock.com/access_persons/" + data.id + "/accesses",
      {
        attributes: {
          accessible_id: "28992f53-7f92-4101-b1b5-1bf1fca693dc",
          accessible_type: "lock"
        }
      },
      {
        headers: {
          Accept: "application/vnd.lockstate+json; version=1",
          "Content-Type": "application/json",
          Authorization: "Bearer " + lockAccessToken
        }
      }
    );

    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error!");
  }
});

app.delete("/api/lock/guest/:lockUser", async function(req, res) {
  try {
    await deleteLockUser(req.params.lockUser);
    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error!");
  }
});

app.post("/api/lock/session", async function(req, res) {
  try {
    res.status(204).end();

    const lockUser = req.body.data.attributes.associated_resource_id;

    const snapshot = await firebase
      .firestore()
      .collection("sessions")
      .where("lockUser", "==", lockUser)
      .where("start", "==", null)
      .get();

    if (snapshot.size > 0) {
      console.log("Guest unlocked door");
      console.log(req.body.data);

      snapshot.docs[0].ref.update({ start: new Date() });
      deleteLockUser(lockUser);
    } else {
      console.log("Someone unlocked door");
      console.log(req.body.data);
    }
  } catch (error) {
    console.log(error);
    //204 prevents request being scheduled for re-send
    res.status(204).end();
  }
});

app.get("/api/lock/:lockId", async function(req, res) {
  try {
  const lock = await axios.get("https://api.remotelock.com/devices/" + req.params.lockId, {
    headers: {
      Accept: "application/vnd.lockstate+json; version=1",
      Authorization: "Bearer " + lockAccessToken
    }
  });

  res.status(200).send(lock.data);

} catch (error) {
  console.log(error);
  res.status(500).send("Server error!");
}
});

exports.api = functions.https.onRequest(app);
