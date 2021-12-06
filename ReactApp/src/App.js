import React from 'react';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import 'bootstrap/dist/css/bootstrap.css'
import './App.css'
import Routes from "./Routes";
import { LinkContainer } from "react-router-bootstrap";

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state={
      name:sessionStorage.getItem("name")
    }
  }
  render() {
    if (this.state.name) {
      return (
        <div className="App container py-3">
          <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
            <LinkContainer to="/">
              <Navbar.Brand className="font-weight-bold text-muted">
                498 Project
              </Navbar.Brand>
            </LinkContainer>
          <Navbar.Toggle />

          <Navbar.Collapse className="justify-content-end">

            <Nav activeKey={window.location.pathname}>
              <LinkContainer to="/edit">
                <Nav.Link href='#link'>Edit Profile</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/logout">
                <Nav.Link></Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes />
        </div>


      );
    } else {
    return (
      <div className="App container py-3">

      <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
        <LinkContainer to="/">
          <Navbar.Brand className="font-weight-bold text-muted">
          498 Project
          {/* <div>{this.state.name}</div> */}
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav activeKey={window.location.pathname}>
            <LinkContainer to="/login">
              <Nav.Link></Nav.Link>
            </LinkContainer>
            <LinkContainer to="/matches">
              <Nav.Link>Learn Skill</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes />
      </div>


    ); }
  }
}

export default App;
