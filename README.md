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

3. (Optional) To connect to middle tier services, change the following:
   ```javascript
   axios.defaults.baseURL = "http://xx.xxx.xxx.xx:4000";
   ```
To your local IP address, or the address of the Firebase hosting url (if running)

4. Run the following command to start the app:

   ```sh
   $ npm start
   ```

4) Follow the instructions in the terminal to run the app on a physical or virtual device.

## Running the app (Node.JS Server)
1. Make sure you're in the remote-working/ directory:

   ```sh
   $ cd remote-working/
   ```

2. Run the following command to install all the required node nodules:

   ```sh
   $ npm install
   ```

4. Run the following command to start the app:

   ```sh
   $ npm run server
   ```


## Contributing

Please refer to CONTRIBUTING.MD

## Acknowledgements

Used the following tutorials:

CRUD Operations: https://www.djamware.com/post/5bbcd38080aca7466989441b/react-native-firebase-tutorial-build-crud-firestore-app

Auth: https://medium.com/react-native-training/react-native-firebase-authentication-7652e1d2c8a2


