# Remote Working - React Native with Firebase

This application is a React Native app with a Node.JS backend.

This application depends on the following third party services:

- Firebase
- Stripe

## Running the app (Front End)

1. Make sure you're in the remote-working/ directory:

   ```sh
   $ cd remote-working/
   ```

2. Run the following command to install all the required node nodules:

   ```sh
   $ npm install
   ```

3. (Optional) To connect to a local middle tier services, change the following:

   ```javascript
   axios.defaults.baseURL = "http://xx.xxx.xxx.xx:4000";
   ```

   To your local IP address, or the address of the Firebase hosting url (if running)

4. Run the following command to start the app:

   ```sh
   $ npm start
   ```

4) Follow the instructions in the terminal to run the app on a physical or virtual device.

## Running the middle tier locally OR deploying a new version

The app's Node JS based middle tier should be running via Firebase hosting on the URL https://remoteruralworking.firebaseapp.com. These are the steps to run this locally or deploy to this domain.

1. Install firebase-tools globally.

   ```sh
   $ npm i -g firebase-tools
   ```

2. Make sure you're in the server directory:

```sh
$ cd remote-working/server
```

3. Run the following command to install all the required node nodules for the functions:

   ```sh
   $ cd functions
   $ npm install
   $ cd ..
   ```

4. Run the following command to build locally
   NOTE: Lock API functions will not work locally unless you build a publicly accessible proxy using ngrok.

   ```sh
   $ firebase serve --only functions,hosting
   ```

   OR

   To deploy to the server:

   ```sh
   $ firebase deploy --only functions,hosting
   ```

5. Provide authorisation for the middle tier to connect to the lock API by copying line 5 of server/functions/index.js into a web browser and following the instructions to log in.

## Contributing

Please refer to CONTRIBUTING.MD

## Acknowledgements

Used the following tutorials:

CRUD Operations: https://www.djamware.com/post/5bbcd38080aca7466989441b/react-native-firebase-tutorial-build-crud-firestore-app

Auth: https://medium.com/react-native-training/react-native-firebase-authentication-7652e1d2c8a2

Firebase Hosting: https://www.youtube.com/watch?v=LOeioOKUKI8
