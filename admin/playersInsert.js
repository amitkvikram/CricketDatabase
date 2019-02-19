const servername = "localhost"
const username = "root"
const passsword = "dbms"
const database = "cricket"

const express = require("express")
const mysql = require("mysql")

const con = mysql.createConnection({
    host: servername,
    user: username,
    password: passsword,
    database: database
})

const rolesArr = ['Batsman', 'Bowler', 'Batting-Allrounder', 'Bowling-Allrounder', 'WK-Batsman']
const battingStyleArr = ["Right Handed Bat", "Left Handed Bat"]
const bowlingStyleArr = ['Right-arm fast', 'Right-arm medium',
                            'Right-arm fast-medium', 'Right-arm legbreak', 'Right-arm offbreak',
                            'Left-arm fast', 'Left-arm medium', 'Left-arm fast-medium',
                            'Left-arm chinaman', 'Left-arm orthodox']

function getInsertForm(req, res){
    res.render("admin/playersInsert", {rolesArr: rolesArr, 
                                        battingStyleArr: battingStyleArr,
                                        bowlingStyleArr: bowlingStyleArr})
}

function insertIntoTable(req, res){
    const playerName = req.body.player_name
    const role = req.body.role
    const dob = req.body.dob
    const batting_style = req.body.batting_style
    const bowling_style = req.body.bowling_style
    console.log("Information to be Inserted: ")
    console.log(playerName, role, dob, batting_style, bowling_style)
    const sql_query = "INSERT INTO Players(player_name, role, "
                    + "dob, batting_style, bowling_style) Values(" 
                    + "'"+playerName+"',"+"'"+role+"',"+"'"+dob+"',"
                    + "'"+batting_style+"',"+"'"+bowling_style+"')"
    console.log(sql_query)
    con.query(sql_query, (err, results, fields)=>{
        if(err){
            res.send("Error")
            throw err
        } 
        else res.send("Success")
    })
}

function getSuggestions(req, res){
    playerName = req.body.player_name
    role = req.body.role
    dob = req.body.dob
    batting_style = req.body.batting_style
    bowling_style = req.body.bowling_style

    console.log(playerName, role, dob, batting_style, bowling_style)

    const sql_query = "SELECT * FROM Players WHERE "+
                        "player_name LIKE '" + playerName + "%'" + 
                        " AND  role = '" + role + "'" + 
                        " AND dob LIKE '" + dob + "%'" +
                        " AND batting_style = '" + batting_style  + "'" +
                        " AND bowling_style = '" + bowling_style  + "'" 

    console.log(sql_query)
    con.query(sql_query, (err, results, fields) => {
        if(err) throw err
        console.log(results)
        console.log("Rendering Suggestions")
        res.render("admin/playersSuggestion", {suggestionList: (results)})
    })
}

module.exports.getInsertForm = getInsertForm
module.exports.insertIntoTable = insertIntoTable
module.exports.getSuggestions = getSuggestions
