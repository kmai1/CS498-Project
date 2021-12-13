from flask import (Flask, render_template, request, redirect, jsonify)
from flask_cors import CORS
import mysql.connector, atexit, csv
from mysql.connector import Error
import numpy as np


app = Flask(__name__)
CORS(app)

dbIP = ''
dbUser = ""
dbPass = ""
dbName = ''

# connection = mysql.connector.connect(host = dbIP, user = dbUser, password = dbPass, database = dbName)

# connection = mysql.connector.connect (
#     host = dbIP,
#     user = dbUser,
#     password = dbPass,
#     database = dbName
# )
'''
sort by desc percentoverdue, skip if reviewed within x amount of time
return [skillValues] * 10

if result == []
done
'''
@app.route("/getFirstTen", methods=['POST'])
def getFirstTen():
    connection = mysql.connector.connect (
        host = dbIP,
        user = dbUser,
        password = dbPass,
        database = dbName
    )
    data = request.get_json()
    # print(data)
    userId = data["userId"]
    connection.reconnect()
    cursor = connection.cursor(buffered = True)

    cursor.execute("select skillValue from skills where userId = {} and HOUR(TIMEDIFF(dateLastReviewed, NOW())) > 8 limit 10".format(userId))
    result = cursor.fetchall()
    # print("backend result", result)
    return jsonify(result)

@app.route("/pullSkillDataViaValue", methods=['POST'])
def pullSkillDataViaValue():
    connection = mysql.connector.connect (
        host = dbIP,
        user = dbUser,
        password = dbPass,
        database = dbName
    )
    data = request.get_json()
    skillValue = data["skillValue"][0]
    connection.reconnect()
    cursor = connection.cursor(buffered = True)
    cursor.execute('select * from skills where skillValue = \"{}\"'.format(skillValue))
    result = cursor.fetchall()
    return jsonify(result)

@app.route("/updateWithSM2Values", methods = ['POST'])
def updateWithSM2Values():
    connection = mysql.connector.connect (
        host = dbIP,
        user = dbUser,
        password = dbPass,
        database = dbName
    )
    data = request.get_json()
    connection.reconnect()
    cursor = connection.cursor(buffered = True)
    userId = 1
    skillValue = data["skillValue"][0]
    updatePercentOverdue = data["percentOverdue"]
    updateDaysBtwnReview = data["daysBtwnReviews"]
    if updateDaysBtwnReview == 0:
        updateDaysBtwnReview = 0.1
    updateDateLastReviewed = data["dateLastReviewed"]
    updateDifficulty = data["diff"]

    updateQuery = ''' update skills set percentOverdue = {}, daysBetweenReview = {},
                                    dateLastReviewed = \"{}\", difficulty = {}
                                    where userId = {} and skillValue = \"{}\"
                '''.format(updatePercentOverdue, updateDaysBtwnReview,updateDateLastReviewed,updateDifficulty, userId, skillValue)
    cursor.execute(updateQuery)
    connection.commit()
    if True:
        return {"success" : 1}
    else:
        return {"success" : 0}

'''
skill 1 pops up
user 1 clicks 0
algo = sm2modified(0, daysBetweenREVIWED, datelastReviewed, difficulty) => {json}
update user 1 skill 1 percent overdue, daysbetweenreviweed, datelastreveiwed, difficulty

pop it outo f the result list
goes throug hall 10...
new button pops up, asks to review more
if reviewMore:
    getFirst10
if getFirst10 is empty:
    new text saying done
'''

if __name__ == "__main__":
        app.run()
