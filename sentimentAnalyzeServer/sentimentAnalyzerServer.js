const express = require('express');
const app = new express();

/*This tells the server to use the client
folder for all static resources*/
app.use(express.static('client'));

/*This tells the server to allow cross origin references*/
const cors_app = require('cors');
app.use(cors_app());

/*Uncomment the following lines to loan the environment
variables that you set up in the .env file*/

const dotenv = require('dotenv');
dotenv.config();

function getNLUInstance() {
    /*Type the code to create the NLU instance and return it.
    You can refer to the image in the instructions document
    to do the same.*/
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new Iamauthenticator({
            apikey: api_key,
        }),
        serviceurl: api_url
    })
    return naturalLanguageUnderstanding;
}


//The default endpoint for the webserver
app.get("/",(req,res)=>{
    console.log("index.html");
    res.render('index.html');
  });

//The endpoint for the webserver ending with /url/emotion
app.get("/url/emotion", (req,res) => {
  //Extract the url passed from the client through the request object
  let urlToAnalyze = req.query.url
  const analyzeParams = 
  {
      "url" : urlToAnalyze,
      "features" : {
        "keywords": {
          "emotion" : true,
          "limit" : 1
        }
      }
  }

  const naturalLanguageUnderstanding = getNLUInstance();

  naturalLanguageUnderstanding.analyze(analyzeParams)
  .then(analysisResults => {
    //Print the JSON returned by NLU instance as a formatted string
    console.log(JSON.stringify(analysisResults.result.keywords[0].emotion,null,2));
    
    //Please refer to the image to see the order of retrieval
    return res.send(analysisResults.result.keywords[0].emotion,null,2);
  })
  .catch(err => {
    return res.send("could not perform the desired operation " + err);
  });
});

//The endpoint for the webserver ending with /url/sentiment
app.get("/url/sentiment", (req,res) => {
  //Extract the url passed from the client through the request object
  let urlToAnalyze = req.query.url
  const analyzeParams = 
  {
      "url" : urlToAnalyze,
      "features" : {
        "keywords": {
          "sentiment" : true,
          "limit" : 1
        }
      }
  }

  const naturalLanguageUnderstanding = getNLUInstance();

  naturalLanguageUnderstanding.analyze(analyzeParams)
  .then(analysisResults => {
    //Print the JSON returned by NLU instance as a formatted string
    console.log(JSON.stringify(analysisResults.result.keywords[0].sentiment,null,2));
    
    //Please refer to the image to see the order of retrieval
    return res.send(analysisResults.result.keywords[0].sentiment,null,2);
  })
  .catch(err => {
    return res.send("could not perform the desired operation " + err);
  });
});

//The endpoint for the webserver ending with /text/emotion
app.get("/text/emotion", (req,res) => {
  const analyzeParams = {
    "text" : req.query.text,
    "features" : {
      "entities" : {
        "emotion" : true,
        "limit" : 1
      },
      "keywords" : {
        "emotion" : true,
        "limit" : 1
      }
    }
  }

  const naturalLanguageUnderstanding = getNLUInstance();

  naturalLanguageUnderstanding.analyze(analyzeParams)
  //Print the JSON returned by NLU instance as a formatted string
  .then(analysisResults => {
    console.log(analysisResults);
    console.log(JSON.stringify(analysisResults.result.entities[0].emotion,null,2));
    //Please refer to the image to see the order of retrieval
    //return res.send(analysisResults.result.keywords[0].emotion,null,2);
    return res.send(analysisResults);
  })
  .catch(err => {
    return res.send("could not do the desired operation " + err);
  });
});

app.get("/text/sentiment", (req,res) => {
  const analyzeParams = {
    "text" : req.query.text,
    "features" : {
      "entities" : {
        "seniment" : true,
        "limit" : 1
      },
      "keywords" : {
        "sentiment" : true,
        "limit" : 1
      }
    }
  }

  const naturalLanguageUnderstanding = getNLUInstance();

  naturalLanguageUnderstanding.analyze(analyzeParams)
  //Print the JSON returned by NLU instance as a formatted string
  .then(analysisResults => {
    console.log(analysisResults);
    console.log(JSON.stringify(analysisResults.result.entities[0].sentiment,null,2));
    //Please refer to the image to see the order of retrieval
    //return res.send(analysisResults.result.keywords[0].sentiment,null,2);
    return res.send(analysisResults);
  })
  .catch(err => {
    return res.send("could not do the desired operation " + err);
  });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

