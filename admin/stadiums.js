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

function getInsertForm(req, res){
    res.render("admin/stadiumInsert")
}

module.exports.getInsertForm = getInsertForm