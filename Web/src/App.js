import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import firebase from "./Firebase";

class App extends Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection("locations");
    this.unsubscribe = null;
    this.state = {
      locations: []
    };
  }

  onCollectionUpdate = querySnapshot => {
    const locations = [];
    querySnapshot.forEach(doc => {
      const { title, description, image, coordinate } = doc.data();
      locations.push({
        key: doc.id,
        doc, // DocumentSnapshot
        title,
        description,
        image,
        coordinate
      });
    });
    this.setState({
      locations
    });
  };

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  render() {
    return (
      <div className="container">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h2 className="panel-title">All Locations</h2>
          </div>
          <div className="panel-body">
            <h4>
              <Link to="/create" className="btn btn-primary">
                Add location
              </Link>
            </h4>
            <table className="table table-stripe">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Image URL</th>
                  <th>Longitude</th>
                  <th>Latitude</th>
                </tr>
              </thead>
              <tbody>
                {this.state.locations.map(location => (
                  <tr>
                    <td>
                      <Link to={`/show/${location.key}`}>{location.title}</Link>
                    </td>
                    <td>{location.description}</td>
                    <td>{location.image}</td>
                    <td>{location.coordinate.longitude}</td>
                    <td>{location.coordinate.latitude}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
