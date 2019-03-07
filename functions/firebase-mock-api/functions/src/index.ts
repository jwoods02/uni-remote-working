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


//Set user id after document creation
// exports.setGuestId = functions.firestore
//   .document('data/{id}')
//   .onCreate((snapshot, context) => {

//      return snapshot.ref.set({

//       id: "036aa265-d008-4c1a-942d-905e7f2ec3e2"

//      }, { merge: true });

//   });



// Set headers
// app.use(function(req, res, next) {
//   // res.setHeader('charset', 'utf-8')
//   res.setHeader('foo', 'bar')
//   next();
// });


// Create an Access Guest
app.post("/access_persons", (req, res) => {
  const promise = Promise.resolve(Math.floor(1000 + Math.random() * 9000));
  const date = new Date();
  promise
    .then(value => {
      db.collection("data")
        .add({
                  type: "access_guest",
                  attributes: {
                    starts_at: date,
                    ends_at: date.setDate(date.getDate() + 1),
                    name: req.body.userId,
                    pin: value,
                    active: true
                  },
                  id: "036aa265-d008-4c1a-942d-905e7f2ec3e2"
                })
        .then(async (docRef) => {

          const things = await docRef.get().then(function(doc) {
            if (doc.exists) {
                return doc.data();
            } else {
                // doc.data() will be undefined in this case
                return "No such document!";
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });




          res.status(200).send(things);

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
app.patch("/access_persons/", (req, res) => {
  const foo: FirebaseFirestore.DocumentData[] = [];
  db.collection("data")
    .where("id", "==", parseInt(req.params.userId))
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


//Grant access to a lock
// app.post("/access_persons/:userId/accesses", (req, res) => {



// });



//Check if access code is valid



//View details for given user
app.get("/user/:userId", (req, res) => {
  const foo: FirebaseFirestore.DocumentData[] = [];
  db.collection("data")
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
