import React from "react";
import "./Home.css";
// import SearchView from "../components/SearchView.js"
import { LinkContainer } from "react-router-bootstrap";
import Nav from "react-bootstrap/Nav";

export default function Home() {
  var UserID = sessionStorage.getItem("UserID")
  var name = sessionStorage.getItem("name")
  // if (UserID == null){ // set == null to force login as opposed to !=
    return (
      <div className="Home">
        <div className="lander">
          <h1>Welcome to Illini Learn</h1>
          <img src="https://www.chicagotribune.com/resizer/GlwuSkEuhPifQl-KOlh-kqHE6sQ=/1200x0/center/middle/cloudfront-us-east-1.images.arcpublishing.com/tronc/OUDDNOJFNNDEPHCCAFNYITZ6Y4.jpg" width="250" height="200" alt="Mascot"></img>
          <LinkContainer to="/matches">
            <Nav.Link >Learn Skills</Nav.Link>
          </LinkContainer>
          <LinkContainer to = "/NotFound">
            <Nav.Link>Learnt Skills</Nav.Link>
          </LinkContainer>
        </div>
      </div>
    );
  // } else { //not logged in yet
  //     return (
  //       <div className="Home">
  //         <div className="lander">
  //           <h1>498 Project</h1>
  //           <p className="text-muted">Learn a skill!</p>
  //         </div>
  //       </div>
  //     );
  // }
}
