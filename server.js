// ------ Importar dependencias ------
const express = require('express');
const dotenv = require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const URL = process.env.MONGODB;
const optionsMongo = { useNewUrlParser: true, useUnifiedTopology: true } 

// ------ Configuración inicial ------
const server = express();
const listenPort = process.env.PORT || 8080;

// JSON support
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

// Levantar el Servidor
server.listen(listenPort,
    () => console.log(`Server listening on ${listenPort}`)
);

// PETICION GET
server.get('/restaurants', (req, res) => {
    // let find = {name: req.body.name}
    // let BO = borough;
    MongoClient.connect(URL, (err, db)=> {
        if (err) throw err;
        let data = db.db("crudapp")
    
        data.collection("restaurants").find({}).toArray( (err, result) => {
            if (err) throw err;
            res.send(result.map(el => el));
            db.close();
        })
        console.log("Working tree clean");
    })
});

// PETICION POST
server.post('/restaurants/create', async (req, res) => {
    let newRest = req.body
    console.log(req.body);
    
    await MongoClient.connect(URL, optionsMongo, (err, db) => {
        if (err) throw err;
        db.db("crudapp")
            .collection("restaurants")
            .insertOne(newRest, (err, result) => {
                if (err) throw err;
                res.send("Restaurant added")
                db.close();
            });
    })
})

// PETICIÓN DELETE
server.delete('/restaurants/delete', (req, res) => {
    let borrar = { name: req.query.name }
    console.log(borrar);

    MongoClient.connect(URL, optionsMongo, (err, db) => {
        if (err) throw err;
        db.db("crudapp")
            .collection("restaurants")
            .deleteOne(borrar, (err, result) => {
                if (err) throw err;
                res.send("Restaurant deleted")
                db.close();
            });
    })
})

// PETICIÓN PUT
server.put('/restaurants/edit', (req, res) => {
    console.log(req.query);
    let editar = { name: req.query.name }
    let cambio = {$set: req.body }

    MongoClient.connect(URL, optionsMongo, (err, db) => {
        if (err) throw err;
        db.db("crudapp")
            .collection("restaurants")
            .updateOne(editar, cambio, (err, result) => {
                if (err) throw err;
                res.send("Restaurant edited")
                db.close();
            });
    })
})