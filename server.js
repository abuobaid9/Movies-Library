'use strict';

const express = require('express');
 const { handle } = require('express/lib/application');
const movieData = require("./MovieData/data.json");
const cors = require("cors");
const axios =require('axios').default;
const apiKey=process.env.API_KEY;
const app = express();
app.use(cors());
const port = 3000
require('dotenv').config();

    app.listen(port, handleListen);
    app.get("/",handleHomepage);

    app.get("/favorite",handleFavorite)
    app.get("//",handleInternalError)
    app.get("*",handleNotFound)

    app.get("/favorite",handleFavorite);
    app.get("/trending",handleTrending);
    app.get("/search",handleSearch);



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
 function handleTrending(req,res){
//   api_key=e38499df126365dd54735bc35087fa19
   const url ="https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=en-US";
     axios.get(url)
     .then(result =>{
        //  console.log(result.data.results);
           let movie = result.data.results.map(movieData => {
            return new MovieDetlies(movieData.id,movieData.title, movieData.release_date, movieData.poster_path, movieData.overview);
        })
        res.json(movie);
        //  res.send("hi");
     
     })
     .catch((error) => {
        console.log(error);
        res.send("Inside catch")
    })
 }
function  handleSearch(req,res){
    // console.log(req.query);
    let movieName = req.query.movieName;
    const url =`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${movieName}&page=2`;
    axios.get(url)
    .then(result => {
        // console.log(result.data.results);
       res.json(result.data.results);
    })
    .catch((error) => {
        console.log(error);
        res.send("Inside catch")
    })



}
//constructer
function MovieDetlies (id,title,release_date, poster_path, overview ){
this.id=id;
this.title=title;
this.release_date=release_date;
this.poster_path=poster_path;
this.overview=overview;
    }

    function handleInternalError(req,res){
        res.status(500).send(" 500 Internal Server Error ");
    }

    function handleNotFound(req, res){
        res.status(404).send("Not Found");

    }

   

