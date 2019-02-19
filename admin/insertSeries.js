const serverName = "localhost"
const username = "root"
const password = "dbms"
const database  = "cricket"

const express = require("express")
const mysql = require("mysql")

//RxJs Observable
const { Observable } = require("rxjs/Observable")
const { zip } = require("rxjs/observable/zip")

const con = mysql.createConnection({
    host:serverName,
    user:username,
    password:password,
    database:database
})

sql_authority = "SELECT * FROM Authority"
sql_series_types = "SELECT * FROM Series_Types"

function getObservable(sqlQuery) {
    return Observable.create(observer=>{
        con.query(sqlQuery, (err, results, fields) => {
            if (err){
                observer.error(err)
            }else{
                observer.next({results:results, fields: fields})
            }
            observer.complete()
        })
    })
}

function init(req, res){
    observerAuthority = getObservable(sql_authority)
    observerSeriesTypes = getObservable(sql_series_types)
    zip(observerAuthority, observerSeriesTypes, (t1, t2)=>{
        return {authority: t1, seriesTypes: t2}
    }).subscribe(
        (data) => {
            res.render("admin/root", {Authority:(data.authority.results), 
                                    SeriesTypes:(data.seriesTypes.results)})
        },
        (err) => {
            throw err
        },
        () => {
            // console.log("Root.js: Completed")
        }
    )
}

module.exports.init = init