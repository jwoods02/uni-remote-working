import * as React from "react";
import { UserContext } from "./user-context";
import firebase from "firebase";

export default class UserProvider extends React.Component {
  constructor() {
    super();
    this.state = {
      setUser: this.setUser.bind(this),
      user: "yellow"
    };
  }
  setUser(user) {
    this.setState({ user });
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user =>
      this.setState({
        user: user
      })
    );
  }
  render() {
    return (
      <UserContext.Provider
        value={{
          userContext: {
            ...this.state
          }
        }}
      >
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

// import * as React from "react";
// import { UserContext } from "./user-context";
// import firebase from "firebase";

// export default class UserProvider extends React.Component {
//   state = {
//     user: null
//   };
//   //need the old set state in here
//   setUser(user) {
//     setState({ user });
//   }

//   componentDidMount() {
//     firebase.auth().onAuthStateChanged(function(user) {
//       if (user) {
//         setUser(user);
//       }
//     });
//   }
//   render() {
//     return (
//       <UserContext.Provider
//         value={{
//           userContext: {
//             ...this.state
//           }
//         }}
//       >
//         {this.props.children}
//       </UserContext.Provider>
//     );
//   }
// }
