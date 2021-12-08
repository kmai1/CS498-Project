import React from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import {Button} from 'react-bootstrap'
import '../App.css'
import '../sm2.js'
class Create extends React.Component {
    constructor(props) {
      super(props);
      //["饭", "你好", "早上好", "晚上好", "你好吗?"]; // pull from database based on %overdue getSkills()
      // let len = skills.length
      // let i = Math.floor(Math.random() * len) // dont need, will output sequentially
      // console.log(i)
      this.state = {
        userId: 1,
        skills: [],
        currSkillIdx: 0,
        skillsLoaded:false
      }
    }


    /*
    psuedocode:
    if skills not empty
      update with next skill
    else
      generate more skills by updating skills
      getSkills()
    */
    update0 = (currSkillIdx) => {
      console.log("test0")
      // var = data {
      //   "UserId"
      // }
      // this.setState({ currSkill: newSkill });
      // displays the currValue
      var newIdx = this.state.currSkillIdx + 1
      var len = this.state.skills.length
      if (newIdx >= len) { //reached of curr list
        this.setState({skillsLoaded: false});
        this.setState({currSkillIdx : 0});
      } else {
        this.setState({currSkillIdx : newIdx})
      }

      //post data to database

    }
    update1 = () => {
      console.log("test1")
    }

    update2 = () => {
      console.log("test2")
    }
    update3 = () => {
      console.log("test3")
    }

    loadSkills = () => {
      console.log("loadSkills")
      this.setState({currSkillIdx : 0})
      this.setState({skillsLoaded: true});
      this.setState({skills : ["饭", "你好", "早上好", "晚上好", "你好吗?"]});
      var data = {
        "userId" : this.state.userId,
        "skillValue" : ""
      }
      var retrivedData = []
      fetch('http://127.0.0.1:5000/getten', {
        headers: {
          "Content-Type" : "application/json"
        },
        method: "POST",
        body: JSON.stringify(data)
      })
      .then(response => response.json()) //.json() .text()
      .then((data) => {
        console.log(data.length)
        for (let x = 0; x < data.length; x++) {
          retrivedData.push(data[x])
        }
        this.setState({skills: retrivedData})
      })

    }

    render() {
      if (!this.state.skillsLoaded) {
        console.log("skills not loaded yet, should be generate screen")
        return (
          <div>
          <Button variant="outline-primary" onClick={this.loadSkills}> Generate skills </Button>
          </div>
        )
      } else {
          console.log("skills should be up rn")
          return (
            <div>
            {this.state.skills[this.state.currSkillIdx]}
            <br/>
            <Button variant="outline-primary" onClick={this.update0}> 0 (No recall) </Button>
            <br/>
            <Button variant="outline-primary" onClick={this.update1}> 1 (Incorrect, familiar after seeing correct answer.)</Button>
            <br/>
            <Button variant="outline-primary" onClick={this.update2}> 2 (Correct, difficult to recall.)</Button>
            <br/>
            <Button variant="outline-primary" onClick={this.update3}> 3 (Correct, perfect recall.)</Button>
            </div>
          )
        }
      }
    }

  export default Create;
