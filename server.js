const express = require('express');
const app = express(); //besoin de créer l'app

app.use('/', express.static(__dirname+"/wwwroot")); // permet de lancer le server dans le browser

/*pour créer un serveur, il n’y plus qu’à choisir le port sur lequel on veut écouter et 
préciser la fonction de callback qui sera appelée quand un client se connecte :*/
app.listen(8000);

app.get('/questions', function(request, response){
    let resultJSON = {
        "questions": [
            {
                "title": "Quel célèbre dictateur dirigea l’URSS \ndu milieu des années 1920 à 1953 ?",
                "answer": ["Staline", "Lenine", "Molotov"],
                "goodAnswer": 0
            },
            {
                "title": "Dans quel pays peut-on trouver la \nCatalogne, l’Andalousie et la Castille ?",
                "answer": ["Italie", "Espagne", "France"],
                "goodAnswer": 1
            },
            {
                "title": "Qui a dit : « Le sort en est jeté » \n(Alea jacta est) ?",
                "answer": ["César", "Atila", "Auguste"],
                "goodAnswer": 0
            },
            {
                "title": "Quel cinéaste a réalisé « Volver » \net « Parle avec elle » ?",
                "answer": ["Woody Allen", "Guillermo Del Toro", "Pedro Almodovar"],
                "goodAnswer": 2
            },
            {
                "title": "À qui doit-on la chanson \n« I Shot the Sheriff » ?",
                "answer": ["Bob Marley", "Eric Clapton", "Jim Morrisson"],
                "goodAnswer": 0
            },
            {
                "title": "Quel pays a remporté la coupe \ndu monde de football en 2014 ?",
                "answer": ["Argentine", "Allemagne", "Brésil"],
                "goodAnswer": 1
            },
            {
                "title": "Dans quelle ville se situe l’action \nde la pièce « Roméo et Juliette »?",
                "answer": ["Vérone", "Venise", "Milan"],
                "goodAnswer": 0
            },
            {
                "title": "Par quel mot désigne-t-on \nune belle-mère cruelle ?",
                "answer": ["Jocrisse", "Godiche", "Marâtre"],
                "goodAnswer": 2
            },
            {
                "title": "Qui était le dieu de la guerre \ndans la mythologie grecque ?",
                "answer": ["Arès", "Hadès", "Hermès"],
                "goodAnswer": 0
            },
            {
                "title": "Parmi les animaux suivants, lequel \npeut se déplacer le plus rapidement ?",
                "answer": ["Le springbok", "Le chevreuil", "Le léopard"],
                "goodAnswer": 0
            }
      ]
    };
    response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify(resultJSON));
});
