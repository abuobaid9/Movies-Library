'use strict';

const express = require('express');
 const { handle } = require('express/lib/application');
const movieData = require("./MovieData/data.json");

const app = express();
const port = 3000

    app.listen(port, handleListen);
    app.get("/",handleHomepage);
    app.get("/favorite",handleFavorite)
    app.get("//",handleInternalError)
    app.get("*",handleNotFound)


//function:
function handleListen(){
    console.log(`welcome port ${port}`);
}
    function handleHomepage(req, res){
       let newData =new MovieDetlies (movieData.title, movieData.poster_path,movieData.overview) ;
    res.json(newData);
    }
 function handleFavorite(req ,res){
  res.send("Welcome to Favorite Page");
 }
//constructer
function MovieDetlies (title  , poster_path, overview ){
this.title=title;
this.poster_path=poster_path;
this.overview=overview;
    }
    function handleInternalError(req,res){
        res.status(500).send(" 500 Internal Server Error ");
    }

    function handleNotFound(req, res){
        res.status(404).send("Not Found");

    }