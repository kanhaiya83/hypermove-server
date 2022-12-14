const mongoose = require("mongoose");

const { Schema } = mongoose;
require("dotenv").config();

let connUri = process.env.DB_URI;
mongoose
  .connect(connUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Mongoose");
  })
  .catch((err) => {
    console.log("Could not connect to mongoose;Error: ", err);
  });

// Creates simple schema for a User.  The hash and salt are derived from the user's given password when they register

const scoreSchema = new Schema({
  name: { type: String, required: true },
  walletAddress: { type: String, required: true },
  score: { type: String, required: true },
  isBanned: { type: Boolean, default: false },
  createdAt: { type: Number },
});
const partnerSchema = new Schema({
  name: { type: String },
  image: { type: String },
  tags: { type: String },
  twitter: { type: String },
  website: { type: String },
});
const tournamentSchema = new Schema({
  title: { type: String },
  prize: { type: Number },
  entryFee: {
    gems: { type: Number },
    tickets: { type: Number },
  },
  isFull:{type:Boolean,default:false},
  createdBy:{type:String},
  playersCount: { type: Number, default: 2 },
  winner:{type:String},
  isDraw:{type:Boolean,default:false},
  isCompleted:{type:Boolean,default:false},
  joinedPlayers: [
    {
      userId: { type: String },
      code: { type: String },
      score: { type: Number },
      hasPlayed:{type:Boolean,default:false},
      gameStartTime: { type: Number },
      gameEndTime:{type:Number},
    },
  ],
});
const userSchema = new Schema({
  name: { type: String },
  userId: { type: String },
  avatar: { type: String },
  address: { type: String },
  messageToSign: { type: String },
  isMetamaskConnected: { type: Boolean },
  isSteamConnected: { type: Boolean },
  timecreated: { type: Number },
  steamid: { type: String },
  personaname: { type: String },
  profileurl: { type: String },
  referralCode: { type: String },
  referredUsers: [{ type: String }],
  referredBy: { type: String, default: null },
  score: { type: Number, default: 0 },
  tickets: { type: Number },
  gems: { type: Number },
});
const poolProjectSchema = new Schema({
  totalRaise:{type:Number,default:10000},
  raised:{type:Number,default:3000},
  investors:[{
    userId:{type:String},
    amount:{type:Number,default:0}
  }]
})
const UserModel = mongoose.model("SteamUser", userSchema);
const ScoreModel = mongoose.model("Score", scoreSchema);
const PartnersModel = mongoose.model("Partners", partnerSchema);
const TournamentModel = mongoose.model("Tournament", tournamentSchema);
const PoolProjectModel = mongoose.model("poolProject", poolProjectSchema);

module.exports = { ScoreModel, UserModel, PartnersModel, TournamentModel, PoolProjectModel };
