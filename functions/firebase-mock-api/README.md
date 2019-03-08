# Remote Working - Firebase Mock API 

## Assumptions

- npm installed

This code provides a mock API deployed in Firebase that simulates a physical connected lock.

## Deploying to Firebase

1. Before getting started, you need to install firebase-tools thought npm:

   ```sh
   $ npm i -g firebase-tools
   ```

2. Login to the Firebase project

   ```sh
   $ firebase login
   $ firebase init
   ```

3. Install package dependencies:

   ```sh
   $ cd functions
   $ npm i --save express body-parser
   ```


## RESTful API

- Create a guest user and generate 4 digit access code

 ```sh
   $ [POST]
   $ https://[YOUR PROJECT]/api/v1/access_persons
   ```