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
const PORT = 3001;
require('dotenv').config();

const apiKey=process.env.API_KEY;
const conPass=process.env.CONPAAS;

const url = `postgres://anas:${conPass}@localhost:5432/movie`;

const { Client } = require('pg');
const client = new Client(url);



    app.get("/",handleHomepage);
    app.get("/favorite",handleFavorite);
    app.get("/trending",handleTrending);
    app.get("/search",handleSearch);
    app.post("/addMovie",handleAdd);
    app.get("/getMovies",handleGet);
    app.put("/updateMovie/:movieName", handleUpdate)    
    app.delete("/deleteMovie/:movieName", handleDelete) 
    app.get("/Movie/:movieName", handleGetMovie)
    app.use(handleError);


//function:

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
        return res.status(201).json(result.rows);
    }).catch()
}
function handleGet(req,res){

    let sql = 'SELECT * from movie;';
    client.query(sql).then((result) => {
        console.log(result);
        res.json(result.rows);
    }).catch((err) => {
         handleError(err, req, res);
    });
}



function handleUpdate(req, res) {
    const { movieName } = req.params;
    const { id, title,release_date,poster_path, overview } = req.body;
    let sql = `UPDATE movie SET id = $1, title = $2, release_date = $3, poster_path = $4 , overview = $5 WHERE id = $6 RETURNING *;`
    let values = [id, title,release_date,poster_path, overview, movieName];

    client.query(sql, values).then(result => {
        console.log(result.rows);
        res.send("working");
        res.json(result.rows[0]);
    }

    ).catch(error => {
        console.log("error in update section", error);
    })
}
// http://localhost:3001/deletemovie?movieName=test
function handleDelete(req, res) {
    const { movieName } = req.params;
    const { id} = req.body;
    console.log(movieName);

    let sql = 'DELETE FROM movie WHERE  id = $1  ;'
    let value = [id];
    client.query(sql, value).then(result => {
        console.log(result);
        res.send("deleted");
    }
    ).catch(error => {
        console.log("error in delete section", error);
    })
}
function handleGetMovie(req,res){
    const { movieName } = req.params;
    const { id, title,release_date,poster_path, overview } = req.body;
    let sql = 'SELECT * from movie ;';
    // WHERE values = ($1,$2,$3,$4,$5,$6)
    // let values = [id, title,release_date,poster_path, overview, movieName];
    client.query(sql).then((result) => {
        console.log(result);
        res.json(result.rows);
    }).catch((err) => {
        handleError(err, req, res);
    });
}

function handleError(error, req, res) {
    res.status(500).send(error);
}

client.connect().then(() => {

    app.listen(PORT, () => {
        console.log(`Server is listening ${PORT}`);
    });
})



//constructer
function MovieDetlies (id,title,release_date, poster_path, overview ){
this.id=id;
this.title=title;
this.release_date=release_date;
this.poster_path=poster_path;
this.overview=overview;
    }
