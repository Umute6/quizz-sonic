const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express(); //besoin de créer l'app

app.use('/', express.static(__dirname+"/wwwroot")); // permet de lancer le server dans le browser

/*pour créer un serveur, il n’y plus qu’à choisir le port sur lequel on veut écouter et 
préciser la fonction de callback qui sera appelée quand un client se connecte :*/
app.listen(8000);

app.get('/questions', function(request, response){
    const url = 'mongodb://127.0.0.1:27017/';
    const mongoClient = new MongoClient(url);
    async function connectDB() { //funct asynchrone
        try { 
            await mongoClient.connect();
            console.log("You successfully connected to DB");
            const quizDatabase = mongoClient.db("Quiz");
            const questionsCollection = quizDatabase.collection("Questions");
            const questionsArray = await questionsCollection.find().toArray();
            let resultJSON = {  
                "questions": questionsArray
            };
            response.setHeader('Content-Type', 'application/json');
            response.send(JSON.stringify(resultJSON));
        }
        catch (error) { console.error(error); }
    }
    connectDB();
    
});
