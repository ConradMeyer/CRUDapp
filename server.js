// 1) ------ Importar dependencias ------
const express = require('express');
const dotenv = require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const URL = process.env.MONGODB;

// 2) ------ Configuración inicial ------
const server = express();
const listenPort = process.env.PORT || 8080;

// JSON support
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.get('/restaurants', (req, res) => {
    // let BO = borough;
    MongoClient.connect(URL, (err, db)=> {
        if (err) throw err;
        let data = db.db("crudapp")
    
        data.collection("restaurants").find({}).toArray( (err, result) => {
            if (err) throw err;
            res.send(result.map(el => el.name));
            db.close();
        })
        console.log("Working tree clean");
    })
});

server.post('/restaurants', (req, res) => {
    // let BO = borough;
    MongoClient.connect(URL, (err, db)=> {
        if (err) throw err;
        let data = db.db("crudapp")
        
        let obj = {
            address: 
            { building: '10',
            coord: [ -73.9829239, 40.6580753 ],
            street: 'Calle de las Aguas',
            zipcode: '28005' },
            borough: 'Latina',
            cuisine: 'Bistró',
            grades: 
            [ { date: "2014-11-19T00:00:00.000Z", grade: 'A', score: 10 },
            { date: "2013-11-14T00:00:00.000Z", grade: 'A', score: 10 },
            { date: "2012-12-05T00:00:00.000Z", grade: 'A', score: 10 },
            { date: "2012-05-17T00:00:00.000Z", grade: 'A', score: 10 } ],
            name: 'Marmitón Bistró',
            restaurant_id: '12345' }

        data.collection("restaurants").insertOne(obj,function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close()
        })
    })
})

server.listen(listenPort,
    () => console.log(`Server listening on ${listenPort}`)
);
