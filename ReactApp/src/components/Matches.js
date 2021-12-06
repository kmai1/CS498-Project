import React from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import {Button} from 'react-bootstrap'
import '../App.css'

class Create extends React.Component {
    constructor(props) {
      super(props);
      let skills = ["饭", "你好", "早上好", "晚上好", "你好吗?"];
      let len = skills.length
      let i = Math.floor(Math.random() * len)
      console.log(i)
      this.state = {
        skills:skills,
        currSkill:skills[i]
      }
    }
    update0 = () => {
      console.log("test0")
      let len = this.state.skills.length
      let i = Math.floor(Math.random() * len)
      console.log(this.state.skills)
      let newSkill = this.state.skills[i]
      this.setState({ currSkill: newSkill });
    }
    update1 = () => {
      console.log(this.state.i)
      this.setState({ currSkill: "I clicked 1" });
    }
    update2 = () => {
      console.log("test2")
      this.setState({ currSkill: "I clicked 2" });
    }
    update3 = () => {
      console.log("test3")
      this.setState({ currSkill: "I clicked 3" });
    }
    update4 = () => {
      console.log("test4")
      this.setState({ currSkill: "I clicked 4" });
    }
    update5 = () => {
      console.log("test5")
      this.setState({ currSkill: "I clicked 5" });
    }
    render() {
      return (

        <div>
        {this.state.currSkill}

        <br/>
        <Button variant="outline-primary" onClick={this.update0}> 0 (No recall) </Button>
        <br/>
        <Button variant="outline-primary" onClick={this.update1}> 1 (Incorrect, familiar after seeing correct answer.)</Button>
        <br/>
        <Button variant="outline-primary" onClick={this.update2}> 2 (Incorrect, easy to recall after seeing correct answer.)</Button>
        <br/>
        <Button variant="outline-primary" onClick={this.update3}> 3 (Correct, difficult to recall.)</Button>
        <br/>
        <Button variant="outline-primary" onClick={this.update4}> 4 (Correct, after some hesistation.)</Button>
        <br/>
        <Button variant="outline-primary" onClick={this.update5}> 5 (Correct, perfect recall.)</Button>
        </div>
    //     {this.state.success === "t" &&
    //       <div>
    //         <table class="table">
    //         <thead>
    //         <tr>
    //             <th class="match-name">Name</th>
    //             <th class="match-major">Major</th>
    //             <th class="match-class-standing">Class Standing</th>
    //             <th class="match-remove">Remove</th>
    //         </tr>
    //         </thead>
    //
    //         {this.state.matchesData.slice(0, this.state.matchesData.length).map((item, index) => {
    //         return (
    //           <tr>
    //             <td>{item[0] + " " + item[1]}</td>
    //             <td>{item[2]}</td>
    //             <td>{item[3]}</td>
    //             <Button variant="outline-danger"onClick={this.removeAndSearch.bind(null,index)}> Remove</Button>
    //           </tr>
    //         );
    //       })}
    //         </table>
    //         </div>
    // }
          // </div>
      )
    }
  }

  export default Create;
