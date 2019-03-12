import React, { Component } from "react";
import ReactDOM from "react-dom";
import firebase from "../Firebase";
import { Link } from "react-router-dom";

class Edit extends Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection("locations");
    this.state = {
      title: "",
      description: "",
      image: "",
      long: "",
      lat: ""
    };
  }

  componentDidMount() {
    const ref = firebase
      .firestore()
      .collection("locations")
      .doc(this.props.match.params.id);
    ref.get().then(doc => {
      if (doc.exists) {
        const location = doc.data();
        this.setState({
          key: doc.id,
          title: location.title,
          description: location.description,
          image: location.image,
          long: location.coordinate.longitude,
          lat: location.coordinate.latitude
        });
      } else {
        console.log("No such document!");
      }
    });
  }

  onChange = e => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  };

  onSubmit = e => {
    e.preventDefault();

    const { title, description, image, long, lat } = this.state;
    let coordinate = {
      latitude: parseFloat(this.state.lat),
      longitude: parseFloat(this.state.long)
    };
    const updateRef = firebase
      .firestore()
      .collection("locations")
      .doc(this.state.key);
    updateRef

      .set({
        title,
        description,
        image,
        coordinate
      })
      .then(docRef => {
        this.setState({
          title: "",
          description: "",
          image: "",
          long: "",
          lat: ""
        });
        this.props.history.push("/");
      })
      .catch(error => {
        console.error("Error adding document: ", error);
      });
  };

  render() {
    return (
      <div className="container">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">Add Location</h3>
          </div>
          <div className="panel-body">
            <h4>
              <Link to="/" className="btn btn-primary">
                View All Locations
              </Link>
            </h4>
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <label for="title">Title:</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={this.state.title}
                  onChange={this.onChange}
                  placeholder="Title"
                />
              </div>
              <div className="form-group">
                <label for="description">Description:</label>
                <textArea
                  className="form-control"
                  name="description"
                  onChange={this.onChange}
                  placeholder="Description"
                  cols="80"
                  rows="3"
                >
                  {this.state.description}
                </textArea>
              </div>
              <div className="form-group">
                <label for="image">image:</label>
                <input
                  type="text"
                  className="form-control"
                  name="image"
                  value={this.state.image}
                  onChange={this.onChange}
                  placeholder="image"
                />
              </div>
              <div className="form-group">
                <label for="image">Long:</label>
                <input
                  type="number"
                  step="any"
                  className="form-control"
                  name="long"
                  value={this.state.long}
                  onChange={this.onChange}
                  placeholder="long"
                />
              </div>
              <div className="form-group">
                <label for="image">Lat:</label>
                <input
                  type="number"
                  step="any"
                  className="form-control"
                  name="lat"
                  value={this.state.lat}
                  onChange={this.onChange}
                  placeholder="lat"
                />
              </div>

              <button type="submit" className="btn btn-success">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Edit;

// import React, { Component } from "react";
// import firebase from "../Firebase";
// import { Link } from "react-router-dom";

// class Edit extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       key: "",
//       title: "",
//       description: "",
//       image: "",
//       coordindate: ""
//     };
//   }

//   componentDidMount() {
//     const ref = firebase
//       .firestore()
//       .collection("locations")
//       .doc(this.props.match.params.id);
//     ref.get().then(doc => {
//       if (doc.exists) {
//         const location = doc.data();
//         this.setState({
//           key: doc.id,
//           title: location.title,
//           description: location.description,
//           image: location.image,
//           coordinate: location.coordinate
//         });
//       } else {
//         console.log("No such document!");
//       }
//     });
//   }

//   onChange = e => {
//     const state = this.state;
//     state[e.target.name] = e.target.value;
//     this.setState({ location: state });
//   };

//   onSubmit = e => {
//     e.preventDefault();

//     const { title, description, image, coordindate } = this.state;

//     const updateRef = firebase
//       .firestore()
//       .collection("locations")
//       .doc(this.state.key);
//     updateRef
//       .set({
//         title,
//         description,
//         image,
//         coordindate
//       })
//       .then(docRef => {
//         this.setState({
//           key: "",
//           title: "",
//           description: "",
//           image: "",
//           coordindate: ""
//         });
//         this.props.history.push("/show/" + this.props.match.params.id);
//       })
//       .catch(error => {
//         console.error("Error adding document: ", error);
//       });
//   };

//   render() {
//     return (
//       <div className="container">
//         <div className="panel panel-default">
//           <div className="panel-heading">
//             <h3 className="panel-title">EDIT location</h3>
//           </div>
//           <div className="panel-body">
//             <h4>
//               <Link to={`/show/${this.state.key}`} className="btn btn-primary">
//                 location List
//               </Link>
//             </h4>
//             <form onSubmit={this.onSubmit}>
//               <div className="form-group">
//                 <label for="title">Title:</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   name="title"
//                   value={this.state.title}
//                   onChange={this.onChange}
//                   placeholder="Title"
//                 />
//               </div>
//               <div className="form-group">
//                 <label for="description">Description:</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   name="description"
//                   value={this.state.description}
//                   onChange={this.onChange}
//                   placeholder="Description"
//                 />
//               </div>
//               <div className="form-group">
//                 <label for="author">Image URL:</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   name="Image"
//                   value={this.state.image}
//                   onChange={this.onChange}
//                   placeholder="Image"
//                 />
//               </div>
//               <div className="form-group">
//                 <label for="author">Coordinates:</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   name="Coordinates"
//                   value={this.state.coordinate}
//                   onChange={this.onChange}
//                   placeholder="Coordinates"
//                 />
//               </div>
//               <button type="submit" className="btn btn-success">
//                 Submit
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default Edit;
