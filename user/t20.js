const serverName = "localhost"
const username = "root"
const password = "dbms"
const database  = "cricket"

const express = require("express")
const mysql = require("mysql")

const con = mysql.createConnection({
    host:serverName,
    user:username,
    password:password,
    database:database
})

var sql = "Select * from Series WHERE format = 'T20'\
         ORDER BY starting_date DESC";

function init(req, res){
    con.query(sql, (err, result, fields)=> {
        if(err){
            console.log("t20.js: Query Could not be fethed")
            throw err
        }
        console.log("T20: Rendering")
        console.log(result)
        return res.render("user/t20", {element:(result)})   
    })
}

function getSeries(req, res){
    const seriesId = req.params.id;
    const sql1 = "Select * from Matches natural join"+
           " Series WHERE series_id = "+seriesId;
    console.log(sql1)
    con.query(sql1, (err, results, fields) => {
        if(err){
            console.log("t20.js: Query for Series could not be fetched")
            throw err
        }
        // console.log()
        return res.send(results);
    })
}

module.exports.init = init;
module.exports.getSeries = getSeries;