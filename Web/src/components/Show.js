import React, { Component } from "react";
import firebase from "../Firebase";
import { Link } from "react-router-dom";
var cardImageStyle = {
  width: "100%",
  height: "50vh",
  objectFit: "cover"
};
class Show extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: {},
      key: ""
    };
  }

  componentDidMount() {
    const ref = firebase
      .firestore()
      .collection("locations")
      .doc(this.props.match.params.id);
    ref.get().then(doc => {
      if (doc.exists) {
        this.setState({
          location: doc.data(),
          key: doc.id,
          isLoading: false
        });
        console.log(doc.data());
      } else {
        console.log("No such document!");
      }
    });
  }

  delete(id) {
    firebase
      .firestore()
      .collection("locations")
      .doc(id)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
        this.props.history.push("/");
      })
      .catch(error => {
        console.error("Error removing document: ", error);
      });
  }

  render() {
    console.log(this.state.location);
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <h4>
                <Link to="/">View All Locations</Link>
              </h4>
              <h1 className="mt-4">{this.state.location.title}</h1>

              <hr />

              <img
                className="img-fluid rounded"
                src={("https:", this.state.location.image + "?fm=jpg&q=90")}
                alt=""
                style={cardImageStyle}
              />
              <hr />
              <p class="lead">Description: {this.state.location.description}</p>
              <hr />
              <p class="lead">Image URL: {this.state.location.image}</p>
              <hr />
            </div>
          </div>
          <Link to={`/edit/${this.state.key}`} className="btn btn-success">
            Edit
          </Link>
          &nbsp;
          <button
            onClick={this.delete.bind(this, this.state.key)}
            className="btn btn-danger"
          >
            Delete
          </button>
        </div>
        <hr />

        <div />
      </div>
    );
  }
}

export default Show;
