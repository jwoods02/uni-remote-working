import React, { Component } from "react";
import firebase from "../Firebase";
import { Link } from "react-router-dom";
import axios from "axios";
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

    this.getLockAttributes("28992f53-7f92-4101-b1b5-1bf1fca693dc").then(
      data => {
        this.setState({
          lockBattery: data.power_level,
          lockSignal: data.signal_quality,
          lockState: data.state
        });
      }
    );
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

  getLockAttributes = async lockId => {
    const lockAttributes = await axios.get(
      "https://remoteruralworking.firebaseapp.com/api/lock/" + lockId
    );
    return lockAttributes.data.data.attributes;
  };

  render() {
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
              <p class="lead">Information: {this.state.location.info}</p>
              <hr />
              <p class="lead">Desks: {this.state.location.desks}</p>
              <hr />
              <p class="lead">Image URL: {this.state.location.image}</p>
              <hr />
              <p class="lead">Lock status: {this.state.lockState}</p>
              <hr />
              <p class="lead">Lock battery level: {this.state.lockBattery}%</p>
              <hr />
              <p class="lead">
                Lock Wi-Fi signal: {parseInt(this.state.lockSignal) * 25}%
              </p>
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
          <div />
        </div>
        <hr />

        <div />
      </div>
    );
  }
}

export default Show;
