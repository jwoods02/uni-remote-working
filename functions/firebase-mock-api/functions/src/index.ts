import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const app = express();
const main = express();
main.use("/api/v1", app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));

export const webApi = functions.https.onRequest(main);

// Generate netcode
app.post("/code", (req, res) => {
  const promise = Promise.resolve(Math.floor(100000 + Math.random() * 900000));

  promise
    .then(value => {
      db.collection("contacts")
        .add({
          userId: req.body.userId,
          propertyId: req.body.propertyId,
          accessCode: value,
          issued: new Date(),
          active: true
                })
        .then(docRef => {
          res.status(200).send(docRef.id);
        })
        .catch(err => {
          console.log("Error adding documents", err);
        });
    })
    .catch(err => {
      console.log("Error! ", err);
    });
});






//Invalidate access code
app.patch("/code", (req, res) => {
  const foo: FirebaseFirestore.DocumentData[] = [];
  db.collection("contacts")
    .where("userId", "==", parseInt(req.params.userId))
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        foo.push(doc.data());
      });
    })
    .then(() => {
      res.status(200).send(foo);
    })
    .catch(err => {
      console.log("Error getting documents", err);
    });
});

//Check if access code is valid



//View details for given user
app.get("/user/:userId", (req, res) => {
  const foo: FirebaseFirestore.DocumentData[] = [];
  db.collection("contacts")
    .where("userId", "==", parseInt(req.params.userId))
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        foo.push(doc.data());
      });
    })
    .then(() => {
      res.status(200).send(foo);
    })
    .catch(err => {
      console.log("Error getting documents", err);
    });
});



//View all data
app.get("/data", (req, res) => {
  const foo: FirebaseFirestore.DocumentData[] = [];
  db.collection("contacts")
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        foo.push(doc.data());
      });
    })
    .then(() => {
      res.status(200).send(foo);
    })
    .catch(err => {
      console.log("Error getting documents", err);
    });
});
