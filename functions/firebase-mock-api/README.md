# Remote Working - Firebase Mock API 

## Assumptions

- npm installed

This code provides a mock API deployed in Firebase that simulates a physical connected lock.

## 1. Deploying to Firebase

You can skip to the next step if you are just testing the API.


1. Before getting started, you need to install firebase-tools thought npm

   ```sh
   $ npm i -g firebase-tools
   ```

2. Login to the Firebase project

   ```sh
   $ firebase login
   $ firebase init
   ```

3. Install package dependencies

   ```sh
   $ cd functions
   $ npm i --save express body-parser
   ```


## 2. Testing RESTful API

You can use an applicaiton like *Postman* to test the API.

In this instance you can replace `[YOUR PROJECT]` with `remote-working-mock-api.firebaseapp.com`.

- `POST` Create a guest user and generate 4 digit access code 

    ```
    https://[YOUR PROJECT]/api/v1/access_persons

   ```
    Request body:
   ```
    {
        name: "Example name"
    }
    ```
    Response:
    ```
    {
        id: [user id]
    }
    ```

- `GET` View all data for a user 

    ```
    https://[YOUR PROJECT]/api/v1/access_persons/[id]
    ```


- `PATCH` Deactive access code for a user

    ```
    https://[YOUR PROJECT]/api/v1/access_persons/[id]/deactivate
    ```  
     Request body (blank body required):
   ```
    {}
    ```  

- `GET` View all users

    ```
    https://[YOUR PROJECT]/api/v1/access_persons
    ```   