const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv/config");


app.use(express.json());

app.get ('/', (req, res)=>{
    res.send("inside the home");
})

//import the router
const userRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
app.use('/api/users/', userRoute) 
app.use('/api/posts/', postRoute) 

mongoose.connect(process.env.DB_connection)
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error(err));

app.listen(8080, ()=> console.log("listening the port 8080"));