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
  score: {type:String,required:true}  ,
  isBanned:{type:Boolean,default:false},
  createdAt:{type:Number}
})
const partnerSchema = new Schema({
  name:{type:String},
  image:{type:String},
  tags:{type:String}
})
const userSchema = new Schema({
    name: {type:String},
    userId: {type:String},
    avatar: {type:String},
    address: {type:String},
    messageToSign: {type:String},
    isMetamaskConnected: {type:Boolean},
    isSteamConnected: {type:Boolean},
    timecreated:{type:Number},
    steamid:{type:String},
    personaname:{type:String},
    profileurl:{type:String},
  })
const UserModel=mongoose.model("SteamUser",userSchema)
const ScoreModel = mongoose.model('Score', scoreSchema);
const PartnersModel = mongoose.model('Partners', partnerSchema);





module.exports = {ScoreModel,UserModel,PartnersModel};
