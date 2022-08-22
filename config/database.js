const mongoose = require('mongoose');


const { Schema } = mongoose;
require('dotenv').config(); 

let connUri=process.env.DB_URI
mongoose
  .connect(connUri, {
    useNewUrlParser: true,
    useUnifiedTopology:true
  })
  .then(() => {
    console.log("Connected to Mongoose");
  })
  .catch((err) => {
    console.log("Could not connect to mongoose;Error: ", err);
  });

// Creates simple schema for a User.  The hash and salt are derived from the user's given password when they register

const scoreSchema = new Schema({
    name: {type:String,required:true},
    walletAddress: {type:String,required:true},
    score: {type:String,required:true}  });
  

const ScoreModel = mongoose.model('Score', scoreSchema);





module.exports = {ScoreModel};
