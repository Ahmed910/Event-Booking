const express = require('express');
const bodyParser = require('body-parser');
const isAuth = require('./middleware/is-auth');
require('dotenv').config()

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');


const {graphqlHTTP} = require('express-graphql')
const {buildSchema} = require('graphql')
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());

app.use((req,res,next) =>{
   res.setHeader('Access-Control-Allow-Origin','*');
   res.setHeader('Access-Control-Allow-Methods','POST,GET,OPTIONS');
   res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
   if(req.method == 'OPTIONS'){
    return res.sendStatus(200);
   }
   next();
});
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.eljk9.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`).then(()=>{
    app.listen(3000);
  }).catch(err=>{
    console.log(err)
  });

app.use(isAuth)  

app.use('/graphql',graphqlHTTP({
     schema:graphQlSchema,
     rootValue:graphQlResolvers,
     graphiql: true,
}))

app.get('/',(req,res,next) => {
    res.send('Hello word')
})

