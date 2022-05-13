'use strict';

const express = require('express');
const { handle } = require('express/lib/application');
const movieData = require("./MovieData/data.json");
const cors = require("cors");
const axios =require('axios').default;
const bodyParser = require('body-parser');



const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 3001;
require('dotenv').config();

const apiKey=process.env.API_KEY;
const conPass=process.env.CONPAAS;
const url = `postgres://anas:${conPass}@localhost:5432/movieDB`;

const { Client } = require('pg');
const client = new Client(url);



    app.listen(port, handleListen);
    app.get("/",handleHomepage);

    app.get("/favorite",handleFavorite)
//     app.get("//",handleInternalError)
//     app.get("*",handleNotFound)

    app.get("/favorite",handleFavorite);
    app.get("/trending",handleTrending);
    app.get("/search",handleSearch);
    app.post("/addMovie",handleAdd);
    app.get("/getMovies",handleGet);
    app.use(handleError);



//function:
client.connect().then(() => {
function handleListen(){
    console.log(`welcome port ${port}`);
}
})

    function handleHomepage(req, res){
            let newData =new MovieDetlies (movieData.title, movieData.poster_path,movieData.overview) ;
    res.json(newData);
    }

 function handleFavorite(req ,res){
  res.send("Welcome to Favorite Page");
 }
 function handleTrending(req,res){

   const url =`https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=en-US`;
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
function handleAdd(req,res){
    // console.log(req.body);
    // res.send("hello from server");

    const { id, title, release_date, poster_path,overview } = req.body;

    let sql = 'INSERT INTO movie(id,title,release_date,poster_path,overview ) VALUES($1, $2, $3, $4,$5) RETURNING *;' // sql query
    let values = [id, title, release_date, poster_path,overview];
    client.query(sql, values).then((result) => {
        console.log(result.rows);
        return res.status(201).json(result.rows[0]);
    }).catch()
}
function handleGet(req,res){

    let sql = 'SELECT * from movei;';
    client.query(sql).then((result) => {
        console.log(result);
        res.json(result.rows);
    }).catch((err) => {
        handleError(err, req, res);
    });
}

function handleError(error, req, res) {
    res.status(500).send(error)
}
//constructer
function MovieDetlies (id,title,release_date, poster_path, overview ){
this.id=id;
this.title=title;
this.release_date=release_date;
this.poster_path=poster_path;
this.overview=overview;
    }

//     function handleInternalError(req,res){
//         res.status(500).send(" 500 Internal Server Error ");
//     }

//     function handleNotFound(req, res){
//         res.status(404).send("Not Found");

//     }