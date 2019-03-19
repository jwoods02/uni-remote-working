import React, { Component } from "react";
import ReactDOM from "react-dom";
import firebase from "../Firebase";
import { Link } from "react-router-dom";

class Create extends Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection("locations");
    this.state = {
      title: "",
      description: "",
      image: "",
      desks: "",
      info: "",
      long: "",
      lat: ""
    };
  }
  onChange = e => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  };

  onSubmit = e => {
    e.preventDefault();

    const { title, description, image, info, desks, long, lat } = this.state;
    var coordinate = {
      latitude: parseFloat(this.state.lat),
      longitude: parseFloat(this.state.long)
    };
    this.ref
      .add({
        title,
        description,
        image,
        coordinate,
        info,
        desks
      })
      .then(docRef => {
        this.setState({
          title: "",
          description: "",
          image: "",
          desks: "",
          info: "",
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
    const { title, description, image, desks, info, long, lat } = this.state;
    return (
      <div className="container">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">Add Location</h3>
          </div>
          <div className="panel-body">
            <h4>
              <Link to="/" className="btn btn-primary">
                All Locations
              </Link>
            </h4>
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <label for="title">Title:</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={title}
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
                  {description}
                </textArea>
              </div>
              <div className="form-group">
                <label for="info">Information:</label>
                <textArea
                  className="form-control"
                  name="info"
                  onChange={this.onChange}
                  placeholder="Information"
                  cols="80"
                  rows="3"
                >
                  {info}
                </textArea>
              </div>
              <div className="form-group">
                <label for="image">Desks:</label>
                <input
                  type="number"
                  step="any"
                  className="form-control"
                  name="desks"
                  value={desks}
                  onChange={this.onChange}
                  placeholder="desks"
                />
              </div>
              <div className="form-group">
                <label for="image">image:</label>
                <input
                  type="text"
                  className="form-control"
                  name="image"
                  value={image}
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
                  value={long}
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
                  value={lat}
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

export default Create;
