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


// Set user id after document creation
exports.setGuestId = functions.firestore
  .document('data/{id}')
  .onCreate((snapshot, context) => {

     return snapshot.ref.set({

      id: snapshot.id

     }, { merge: true });

  });



// Set headers
// app.use(function(req, res, next) {
//   // res.setHeader('charset', 'utf-8')
//   res.setHeader('foo', 'bar')
//   next();
// });


// Create an Access Guest with code
app.post("/access_persons", (req, res) => {
  const promise = Promise.resolve(Math.floor(1000 + Math.random() * 9000));
  // const date = new Date();
  promise
    .then(value => {
      db.collection("data")
        .add({
                  type: "access_guest",
                  attributes: {
                    starts_at: new Date(),
                    ends_at: new Date().setDate(new Date().getDate() + 1),
                    name: req.body.name,
                    pin: value,
                    active: true
                  }
                })
        .then(docRef => {

          res.status(200).send(docRef.id);

        })
        .catch(err => {
          console.log("Error creating guest", err);
        });
    })
    .catch(err => {
      console.log("Error! ", err);
    });
});



// Deactivate access code
app.patch("/access_persons/:id/deactivate", (req, res) => {

  db.collection("data").doc(req.params.id).update( { "attributes.active": false })
  .then(() => {
    res.status(200).send("Access code deactived")
  }).catch(err => {
    console.log("Error updating documents", err);
  });

});



//View details for given user
app.get("/access_persons/:id", (req, res) => {
  
  db.collection("data")
    .where("id", "==", req.params.id)
    .get()
    .then(querySnapshot => {
      let docRef: FirebaseFirestore.DocumentData;
      querySnapshot.forEach(doc => {
        docRef = doc;
      });
      return docRef;
    })
    .then(docRef => {
      res.status(200).send(docRef.data());
    })
    .catch(err => {
      console.log("Error getting documents", err);
    });
});



//View all data
app.get("/access_persons", (req, res) => {
  const foo: FirebaseFirestore.DocumentData[] = [];
  db.collection("data")
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
