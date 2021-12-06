import React from "react";
import "./Home.css";
// import SearchView from "../components/SearchView.js"
import { LinkContainer } from "react-router-bootstrap";
import Nav from "react-bootstrap/Nav";

export default function Home() {
  var UserID = sessionStorage.getItem("UserID")
  var name = sessionStorage.getItem("name")
  if (UserID == null){ // set == null to force login as opposed to !=
    return (
      <div className="Home">
        <div className="lander">
          <h1>Welcome to Skill Learner</h1>
          <img src="https://www.logocowboy.com/wp-content/uploads/2015/12/fatgeek3.png" width="250" height="200" alt="Mascot"></img>
          <LinkContainer to="/matches">
            <Nav.Link >Learn Skills</Nav.Link>
          </LinkContainer>
          <LinkContainer to = "/NotFound">
            <Nav.Link>Learnt Skills</Nav.Link>
          </LinkContainer>
        </div>
      </div>
    );
  } else { //not logged in yet
      return (
        <div className="Home">
          <div className="lander">
            <h1>498 Project</h1>
            <p className="text-muted">Learn a skill!</p>
          </div>
        </div>
      );
  }
}
