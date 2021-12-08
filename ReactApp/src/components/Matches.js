import React from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import {Button} from 'react-bootstrap'
import '../App.css'
// import {sm2} from '../sm2.js'

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
    sm2Modified = (performanceRating, daysBetweenReviews, dateLastReviewed, difficulty) => {

      let percentOverdue = 1.0
      if (performanceRating >= 0.6) {
          percentOverdue = Math.min(2.0, (new Date() - dateLastReviewed) / 1000.0 / 60 / 60 / 24 / daysBetweenReviews)
          difficulty += percentOverdue * (1.0/17.0) * (8.0 - 9.0 * performanceRating)
          if (difficulty < 0.0) difficulty = 0.0
          if (difficulty > 1.0) difficulty = 1.0
          let difficultyWeight = 3 - 1.7 * difficulty
          daysBetweenReviews *= 1.0 + (difficultyWeight - 1.0) * percentOverdue * (Math.random() / 10.0 + 0.95)
          percentOverdue = Math.min(2.0, (new Date() - dateLastReviewed) / 1000.0 / 60 / 60 / 24 / daysBetweenReviews)
      } else {
          difficulty += percentOverdue * (1.0/17.0) * (8.0 - 9.0 * performanceRating)
          if (difficulty < 0.0) difficulty = 0.0
          if (difficulty > 1.0) difficulty = 1.0
          daysBetweenReviews *= 1.0 / (1.0 + 3.0 * difficulty)
      }

      return { percentOverdue: percentOverdue, daysBtwnReviews: daysBetweenReviews, dateLastReviewed: new Date(), diff: difficulty }
    }
    convertSQLtoJS = (sqlDateTime) => {
      // Split timestamp into [ Y, M, D, h, m, s ]
      var t = sqlDateTime.split(/[- :]/);
      console.log("sqlDateTime", sqlDateTime)
      // Apply each element to the Date function
      var jsDate = new Date((t[0], t[1]-1, t[2], t[3], t[4], t[5]))
      return jsDate
    }

    convertJStoSQL = (jsDate) => {
      return jsDate.toISOString().slice(0, 19).replace('T', ' ');
    }


    /*
    psuedocode:
    if skills not empty
      update with next skill
    else
      generate more skills by updating skills
      getSkills()
    */
    update0 = () => {
      //update database first, then lookup next value
      let currSkillValue = this.state.skills[[this.state.currSkillIdx]]
      var data = {
        "skillValue" : currSkillValue
      }
      //this builds retrievedData
      fetch('http://127.0.0.1:5000/pullSkillDataViaValue', {
        headers : {
          "Content-Type" : "application/json"
        },
        method: "POST",
        body : JSON.stringify(data)
      })
      .then(response => response.json())
      .then((data) => {
        // 0 indexed
        // userid skillid skillvalue daysbetweenrev datelastrev diff percentoverdue
        var userId = data[0][0];
        var skillId = data[0][1];
        var skillValue = data[0][2];
        var daysBetweenReview = data[0][3];
        var dateLastReviewed = data[0][4];
        var difficulty = data[0][5];
        var percentOverdue = data[0][6];
        var retrievedData = {
          "performanceRating" : 0, // bc we clicked the 0
          "userId" : 1,
          "skillId" : 0,
          "skillValue" : 0,
          "daysBetweenReview" : 0.1,
          "dateLastReviewed" : "",
          "difficulty" : 0.0,
          "percentOverdue" : 0.0
        }
        retrievedData["userId"] = userId; //never null
        retrievedData["skillId"] = skillId; //never null
        retrievedData["skillValue"] = skillValue; //never null
        if (daysBetweenReview == undefined || daysBetweenReview == 0) {
          retrievedData["daysBetweenReview"] = 0.1;
        } else {
          retrievedData["daysBetweenReview"] = daysBetweenReview;
        }
        console.log(retrievedData["dataLastReviewed"])
        if (dateLastReviewed == undefined) {
          retrievedData["dateLastReviewed"] = this.convertJStoSQL(new Date()); //note this is sql datetime format
        } else {
          retrievedData["dateLastReviewed"] = dateLastReviewed; //this is in a sql datetime format
        }

        retrievedData["difficulty"] = difficulty;
        retrievedData["percentOverdue"] = percentOverdue;

        // var algoOutputPassThrough = {
        //   "userId" : this.state.userId,
        //   "currValue" : this.state.skills[this.state.currSkillIdx],
        //   "percentOverdue" : 0,
        //   "daysBtwnReview" : 0,
        //   "dateLastReviewed" : "",
        //   "difficulty" : 0
        // };

        console.log("algo input", retrievedData["performanceRating"],
                                          retrievedData["daysBetweenReview"],
                                          this.convertSQLtoJS(retrievedData["dateLastReviewed"]),
                                          retrievedData["difficulty"])
                                          console.log("sqltojs input", retrievedData["datelastReviewed"])
        console.log("sqltojs", this.convertSQLtoJS(retrievedData["dateLastReviewed"]))
        console.log("sqltojstype", this.convertSQLtoJS(retrievedData["dateLastReviewed"]))
        var algoOutput = this.sm2Modified(retrievedData["performanceRating"],
                                          retrievedData["daysBetweenReview"],
                                          this.convertSQLtoJS(retrievedData["dateLastReviewed"]),
                                          retrievedData["difficulty"])

        var passThrough = algoOutput
        passThrough["dateLastReviewed"] = this.convertJStoSQL(algoOutput["dateLastReviewed"])
        passThrough["skillValue"] = currSkillValue
        console.log("datsbetweenvalue", passThrough["daysBtwnReview"])
        if (passThrough["daysBtwnReview"] ==  0) {
          passThrough["daysBtwnReview"] = 0.1
        }
        fetch('http://127.0.0.1:5000/updateWithSM2Values', {
          headers : {
            "Content-Type" : "application/json"
          },
          method: "POST",
          body : JSON.stringify(passThrough)
        })
        .then(response => response.json())
        .then((passThrough) => {
          if (passThrough["success"] == 1) {
            console.log("data updated successfully")
          } else {
            console.log("data update process ran into a problem")
          }
        })
      })

      // displays the nextcurrValue
      var newIdx = this.state.currSkillIdx + 1
      var len = this.state.skills.length
      if (newIdx >= len) { //reached of curr list
        this.setState({skillsLoaded: false});
        this.setState({currSkillIdx : 0});
      } else {
        this.setState({currSkillIdx : newIdx})
      }
    }
    update1 = () => {
      //update database first, then lookup next value
      let currSkillValue = this.state.skills[[this.state.currSkillIdx]]
      var data = {
        "skillValue" : currSkillValue
      }
      //this builds retrievedData
      fetch('http://127.0.0.1:5000/pullSkillDataViaValue', {
        headers : {
          "Content-Type" : "application/json"
        },
        method: "POST",
        body : JSON.stringify(data)
      })
      .then(response => response.json())
      .then((data) => {
        // 0 indexed
        // userid skillid skillvalue daysbetweenrev datelastrev diff percentoverdue
        var userId = data[0][0];
        var skillId = data[0][1];
        var skillValue = data[0][2];
        var daysBetweenReview = data[0][3];
        var dateLastReviewed = data[0][4];
        var difficulty = data[0][5];
        var percentOverdue = data[0][6];
        var retrievedData = {
          "performanceRating" : 0.33, // bc we clicked the 0
          "userId" : 1,
          "skillId" : 0,
          "skillValue" : 0,
          "daysBetweenReview" : 0.1,
          "dateLastReviewed" : "",
          "difficulty" : 0.0,
          "percentOverdue" : 0.0
        }
        retrievedData["userId"] = userId; //never null
        retrievedData["skillId"] = skillId; //never null
        retrievedData["skillValue"] = skillValue; //never null
        if (daysBetweenReview == undefined || daysBetweenReview == 0) {
          retrievedData["daysBetweenReview"] = 0.1;
        } else {
          retrievedData["daysBetweenReview"] = daysBetweenReview;
        }
        console.log(retrievedData["dataLastReviewed"])
        if (dateLastReviewed == undefined) {
          retrievedData["dateLastReviewed"] = this.convertJStoSQL(new Date()); //note this is sql datetime format
        } else {
          retrievedData["dateLastReviewed"] = dateLastReviewed; //this is in a sql datetime format
        }

        retrievedData["difficulty"] = difficulty;
        retrievedData["percentOverdue"] = percentOverdue;

        // var algoOutputPassThrough = {
        //   "userId" : this.state.userId,
        //   "currValue" : this.state.skills[this.state.currSkillIdx],
        //   "percentOverdue" : 0,
        //   "daysBtwnReview" : 0,
        //   "dateLastReviewed" : "",
        //   "difficulty" : 0
        // };

        console.log("algo input", retrievedData["performanceRating"],
                                          retrievedData["daysBetweenReview"],
                                          this.convertSQLtoJS(retrievedData["dateLastReviewed"]),
                                          retrievedData["difficulty"])
                                          console.log("sqltojs input", retrievedData["datelastReviewed"])
        console.log("sqltojs", this.convertSQLtoJS(retrievedData["dateLastReviewed"]))
        console.log("sqltojstype", this.convertSQLtoJS(retrievedData["dateLastReviewed"]))
        var algoOutput = this.sm2Modified(retrievedData["performanceRating"],
                                          retrievedData["daysBetweenReview"],
                                          this.convertSQLtoJS(retrievedData["dateLastReviewed"]),
                                          retrievedData["difficulty"])

        var passThrough = algoOutput
        passThrough["dateLastReviewed"] = this.convertJStoSQL(algoOutput["dateLastReviewed"])
        passThrough["skillValue"] = currSkillValue
        console.log("datsbetweenvalue", passThrough["daysBtwnReview"])
        if (passThrough["daysBtwnReview"] ==  0) {
          passThrough["daysBtwnReview"] = 0.1
        }
        fetch('http://127.0.0.1:5000/updateWithSM2Values', {
          headers : {
            "Content-Type" : "application/json"
          },
          method: "POST",
          body : JSON.stringify(passThrough)
        })
        .then(response => response.json())
        .then((passThrough) => {
          if (passThrough["success"] == 1) {
            console.log("data updated successfully")
          } else {
            console.log("data update process ran into a problem")
          }
        })
      })

      // displays the nextcurrValue
      var newIdx = this.state.currSkillIdx + 1
      var len = this.state.skills.length
      if (newIdx >= len) { //reached of curr list
        this.setState({skillsLoaded: false});
        this.setState({currSkillIdx : 0});
      } else {
        this.setState({currSkillIdx : newIdx})
      }
    }
    update2 = () => {
      //update database first, then lookup next value
      let currSkillValue = this.state.skills[[this.state.currSkillIdx]]
      var data = {
        "skillValue" : currSkillValue
      }
      //this builds retrievedData
      fetch('http://127.0.0.1:5000/pullSkillDataViaValue', {
        headers : {
          "Content-Type" : "application/json"
        },
        method: "POST",
        body : JSON.stringify(data)
      })
      .then(response => response.json())
      .then((data) => {
        // 0 indexed
        // userid skillid skillvalue daysbetweenrev datelastrev diff percentoverdue
        var userId = data[0][0];
        var skillId = data[0][1];
        var skillValue = data[0][2];
        var daysBetweenReview = data[0][3];
        var dateLastReviewed = data[0][4];
        var difficulty = data[0][5];
        var percentOverdue = data[0][6];
        var retrievedData = {
          "performanceRating" : 0.66, // bc we clicked the 0
          "userId" : 1,
          "skillId" : 0,
          "skillValue" : 0,
          "daysBetweenReview" : 0.1,
          "dateLastReviewed" : "",
          "difficulty" : 0.0,
          "percentOverdue" : 0.0
        }
        retrievedData["userId"] = userId; //never null
        retrievedData["skillId"] = skillId; //never null
        retrievedData["skillValue"] = skillValue; //never null
        if (daysBetweenReview == undefined || daysBetweenReview == 0) {
          retrievedData["daysBetweenReview"] = 0.1;
        } else {
          retrievedData["daysBetweenReview"] = daysBetweenReview;
        }
        console.log(retrievedData["dataLastReviewed"])
        if (dateLastReviewed == undefined) {
          retrievedData["dateLastReviewed"] = this.convertJStoSQL(new Date()); //note this is sql datetime format
        } else {
          retrievedData["dateLastReviewed"] = dateLastReviewed; //this is in a sql datetime format
        }

        retrievedData["difficulty"] = difficulty;
        retrievedData["percentOverdue"] = percentOverdue;

        // var algoOutputPassThrough = {
        //   "userId" : this.state.userId,
        //   "currValue" : this.state.skills[this.state.currSkillIdx],
        //   "percentOverdue" : 0,
        //   "daysBtwnReview" : 0,
        //   "dateLastReviewed" : "",
        //   "difficulty" : 0
        // };

        console.log("algo input", retrievedData["performanceRating"],
                                          retrievedData["daysBetweenReview"],
                                          this.convertSQLtoJS(retrievedData["dateLastReviewed"]),
                                          retrievedData["difficulty"])
                                          console.log("sqltojs input", retrievedData["datelastReviewed"])
        console.log("sqltojs", this.convertSQLtoJS(retrievedData["dateLastReviewed"]))
        console.log("sqltojstype", this.convertSQLtoJS(retrievedData["dateLastReviewed"]))
        var algoOutput = this.sm2Modified(retrievedData["performanceRating"],
                                          retrievedData["daysBetweenReview"],
                                          this.convertSQLtoJS(retrievedData["dateLastReviewed"]),
                                          retrievedData["difficulty"])

        var passThrough = algoOutput
        passThrough["dateLastReviewed"] = this.convertJStoSQL(algoOutput["dateLastReviewed"])
        passThrough["skillValue"] = currSkillValue
        console.log("datsbetweenvalue", passThrough["daysBtwnReview"])
        if (passThrough["daysBtwnReview"] ==  0) {
          passThrough["daysBtwnReview"] = 0.1
        }
        fetch('http://127.0.0.1:5000/updateWithSM2Values', {
          headers : {
            "Content-Type" : "application/json"
          },
          method: "POST",
          body : JSON.stringify(passThrough)
        })
        .then(response => response.json())
        .then((passThrough) => {
          if (passThrough["success"] == 1) {
            console.log("data updated successfully")
          } else {
            console.log("data update process ran into a problem")
          }
        })
      })

      // displays the nextcurrValue
      var newIdx = this.state.currSkillIdx + 1
      var len = this.state.skills.length
      if (newIdx >= len) { //reached of curr list
        this.setState({skillsLoaded: false});
        this.setState({currSkillIdx : 0});
      } else {
        this.setState({currSkillIdx : newIdx})
      }
    }
    update3 = () => {
      //update database first, then lookup next value
      let currSkillValue = this.state.skills[[this.state.currSkillIdx]]
      var data = {
        "skillValue" : currSkillValue
      }
      //this builds retrievedData
      fetch('http://127.0.0.1:5000/pullSkillDataViaValue', {
        headers : {
          "Content-Type" : "application/json"
        },
        method: "POST",
        body : JSON.stringify(data)
      })
      .then(response => response.json())
      .then((data) => {
        // 0 indexed
        // userid skillid skillvalue daysbetweenrev datelastrev diff percentoverdue
        var userId = data[0][0];
        var skillId = data[0][1];
        var skillValue = data[0][2];
        var daysBetweenReview = data[0][3];
        var dateLastReviewed = data[0][4];
        var difficulty = data[0][5];
        var percentOverdue = data[0][6];
        var retrievedData = {
          "performanceRating" : 1, // bc we clicked the 0
          "userId" : 1,
          "skillId" : 0,
          "skillValue" : 0,
          "daysBetweenReview" : 0.1,
          "dateLastReviewed" : "",
          "difficulty" : 0.0,
          "percentOverdue" : 0.0
        }
        retrievedData["userId"] = userId; //never null
        retrievedData["skillId"] = skillId; //never null
        retrievedData["skillValue"] = skillValue; //never null
        if (daysBetweenReview == undefined || daysBetweenReview == 0) {
          retrievedData["daysBetweenReview"] = 0.1;
        } else {
          retrievedData["daysBetweenReview"] = daysBetweenReview;
        }
        console.log(retrievedData["dataLastReviewed"])
        if (dateLastReviewed == undefined) {
          retrievedData["dateLastReviewed"] = this.convertJStoSQL(new Date()); //note this is sql datetime format
        } else {
          retrievedData["dateLastReviewed"] = dateLastReviewed; //this is in a sql datetime format
        }

        retrievedData["difficulty"] = difficulty;
        retrievedData["percentOverdue"] = percentOverdue;

        // var algoOutputPassThrough = {
        //   "userId" : this.state.userId,
        //   "currValue" : this.state.skills[this.state.currSkillIdx],
        //   "percentOverdue" : 0,
        //   "daysBtwnReview" : 0,
        //   "dateLastReviewed" : "",
        //   "difficulty" : 0
        // };

        console.log("algo input", retrievedData["performanceRating"],
                                          retrievedData["daysBetweenReview"],
                                          this.convertSQLtoJS(retrievedData["dateLastReviewed"]),
                                          retrievedData["difficulty"])
                                          console.log("sqltojs input", retrievedData["datelastReviewed"])
        console.log("sqltojs", this.convertSQLtoJS(retrievedData["dateLastReviewed"]))
        console.log("sqltojstype", this.convertSQLtoJS(retrievedData["dateLastReviewed"]))
        var algoOutput = this.sm2Modified(retrievedData["performanceRating"],
                                          retrievedData["daysBetweenReview"],
                                          this.convertSQLtoJS(retrievedData["dateLastReviewed"]),
                                          retrievedData["difficulty"])

        var passThrough = algoOutput
        passThrough["dateLastReviewed"] = this.convertJStoSQL(algoOutput["dateLastReviewed"])
        passThrough["skillValue"] = currSkillValue
        console.log("datsbetweenvalue", passThrough["daysBtwnReview"])
        if (passThrough["daysBtwnReview"] ==  0) {
          passThrough["daysBtwnReview"] = 0.1
        }
        fetch('http://127.0.0.1:5000/updateWithSM2Values', {
          headers : {
            "Content-Type" : "application/json"
          },
          method: "POST",
          body : JSON.stringify(passThrough)
        })
        .then(response => response.json())
        .then((passThrough) => {
          if (passThrough["success"] == 1) {
            console.log("data updated successfully")
          } else {
            console.log("data update process ran into a problem")
          }
        })
      })

      // displays the nextcurrValue
      var newIdx = this.state.currSkillIdx + 1
      var len = this.state.skills.length
      if (newIdx >= len) { //reached of curr list
        this.setState({skillsLoaded: false});
        this.setState({currSkillIdx : 0});
      } else {
        this.setState({currSkillIdx : newIdx})
      }
    }

    // add for when no skills left if []: then set noskillsleft = TRUE
    // else if not, set it back to false, add this under.then((data) => ...)
    loadSkills = () => {
      console.log("loadSkills")
      this.setState({currSkillIdx : 0})
      this.setState({skillsLoaded: true});
      // this.setState({skills : ["饭", "你好", "早上好", "晚上好", "你好吗?"]});
      var data = {
        "userId" : this.state.userId,
      }
      var retrievedData = []
      fetch('http://127.0.0.1:5000/getFirstTen', {
        headers: {
          "Content-Type" : "application/json"
        },
        method: "POST",
        body: JSON.stringify(data)
      })
      .then(response => response.json()) //.json() .text()
      .then((data) => {
        console.log(data.length)
        if (data.length == 0) {
          this.setState({skillsLoaded:false})
        }
        for (let x = 0; x < data.length; x++) {
          retrievedData.push(data[x])
        }
        this.setState({skills: retrievedData})
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
