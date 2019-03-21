const serverName = "localhost"
const username = "root"
const password = "dbms"
const database  = "cricket"

const express = require("express")
const mysql = require("mysql")
const { Observable } = require("rxjs/Observable")
const { zip } = require("rxjs/observable/zip")

const con = mysql.createConnection({
    host:serverName,
    user:username,
    password:password,
    database:database
})

var series_query = "Select * from Series WHERE format = 'T20'\
         ORDER BY starting_date DESC"

var country_query = 'SELECT * FROM Countries ORDER BY country_name'

var teams_query = 'SELECT team_name from Teams ORDER BY team_name'

function getCountryQueryObservable(){
    return Observable.create(subscriber => {
        con.query(country_query, (err, results, fields)=>{
            if(err) subscriber.error(err)   
            else subscriber.next({results: results, fields: fields})
            subscriber.complete()
        })
    })
}

function getTeamsQueryObservable(){
    return Observable.create(subscriber => {
        con.query(teams_query, (err, results, fields)=> {
            if(err){
                subscriber.error(err)
            }else{
                subscriber.next({results: results, fields: fields})
            }
            subscriber.complete()
        })
    })
}

function getSeriesQueryObservable(){
    return Observable.create(subscriber => {
        con.query(series_query, (err, results, fields)=> {
            if(err){
                subscriber.error(err)
            }else{
                subscriber.next({results: results, fields:fields})
            }
            subscriber.complete()  
        })
    })
    
}

function init(req, res){
    zip(getCountryQueryObservable(),
        getSeriesQueryObservable(),
        getTeamsQueryObservable(), 
        (t1, t2, t3)=>{
                return {countries: t1, series: t2, teams: t3}
            }
        ).subscribe(
            (data)=>{
                console.log("T20: Rendering")
                return res.render("user/t20", 
                    {series: data.series.results,
                     countries: data.countries.results, 
                     teams: data.teams.results}) 
            },
            (err)=>{
                throw err
            },
            ()=>{}
        )
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
        return res.send(results);
    })
}

module.exports.init = init;
module.exports.getSeries = getSeries;