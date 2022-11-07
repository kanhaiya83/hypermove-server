const express = require("express");
const { TournamentModel, UserModel } = require("../config/database");
const verifyJWT = require("../middlewares/verifyJWT");
const router = express.Router();
var randomstring = require("randomstring");
router.get("/", async (req, res) => {
  try {
    const tournamentsList = await TournamentModel.find({});
    return res.send({ success: true, tournamentsList });
  } catch (e) {
    console.log("Error in tournament/get =>", e);
    res.status(500).send({ success: false });
  }
});

router.get("/joined",verifyJWT, async (req, res) => {
  try {
    const tournamentsList = await TournamentModel.find({
      $or: [{ "joinedPlayers.userId": req.userId }],
    });

    return res.send({ success: true, tournamentsList });
  } catch (e) {
    console.log("Error in tournament/get =>", e);
    res.status(500).send({ success: false });
  }
});

router.get("/verify/:code", async (req, res) => {
  const { code } = req.params;
  const tournament = await TournamentModel.findOne({
    "joinedPlayers.code": code,
  });
  if (!tournament) {
    return res.send({ success: false });
  }
  return res.send({
    success: true,
    tournament,
  });
});
router.get("/submit", async (req, res) => {
  const { code, score } = req.query;
  const tournament = await TournamentModel.findOneAndUpdate(
    {
      "joinedPlayers.code": code,
      "joinedPlayers.hasCompleted": false,
    },
    {$set:{ "joinedPlayers.$.hasCompleted": true, "joinedPlayers.$.score": score }},
    { new: true }
  );
  if (!tournament) {
    return res.send({ success: false });
  }
  if(tournament.joinedPlayers.length >1){
    const player_1 =tournament.joinedPlayers[0]
    const player_2 =tournament.joinedPlayers[1]
    if(player_1.hasCompleted && player_2.hasCompleted){
      if(player_1.score > player_2.score){
        await TournamentModel.findByIdAndUpdate(tournament._id,{
          winner: player_1.userId
        })
        await UserModel.findByIdAndUpdate(player_1.userId,{
          $inc:{
            gems:tournament.prize,
            tickets:2*(tournament.entryFee.tickets),
          }
        })
      }else if(player_2.score > player_1.score){
        await TournamentModel.findByIdAndUpdate(tournament._id,{
          winner: player_2.userId
        })
        
        await UserModel.findByIdAndUpdate(player_2.userId,{
          $inc:{
            gems:tournament.prize,
            tickets:2*(tournament.entryFee.tickets),
          }
        })
      }else if(player_2.score === player_1.score){
        await TournamentModel.findByIdAndUpdate(tournament._id,{
          isDraw:true
        })
        
        await UserModel.findByIdAndUpdate(player_1.userId,{
          $inc:{
            gems:(tournament.prize)/2,
            tickets:(tournament.entryFee.tickets),
          }
        })
        
        await UserModel.findByIdAndUpdate(player_2.userId,{
          $inc:{
            gems:(tournament.prize)/2,
            tickets:(tournament.entryFee.tickets),
          }
        })
      }
    }
  }
  return res.send({
    success: true,
    tournament,
  });
});
router.get("/join", verifyJWT, async (req, res) => {
  const { tournamentId } = req.query;
  const {userId} = req
  const tournament = await TournamentModel.findOneAndUpdate(
    {
      _id: tournamentId,
      isFull: false,
    },
    {
      $push: {
        joinedPlayers: {
          userId,
          code: randomstring.generate(10),
          timeJoined: new Date().getTime(),
        },
      },
      isFull:true
    }
  ,{new:true});
  if (!tournament) {
    return res.send({ success: false });
  }
  return res.send({
    success: true,
    tournament
  });
});
router.post("/", verifyJWT, async (req, res) => {
  // await UserModel.updateOne({_id:req.userId},{gems:1000,tickets:200    })
  try {
    const { entryFee } = req.body.tournamentData;
    const gemsUsed = parseInt(entryFee.gems);
    const ticketsUsed = parseInt(entryFee.tickets);

    const foundUser = await UserModel.findById(req.userId);
    if (foundUser.gems < gemsUsed || foundUser.tickets < ticketsUsed) {
      return res.send({ success: false });
    }
    const user = await UserModel.findByIdAndUpdate(
      req.userId,
      { $inc: { gems: -gemsUsed, tickets: -ticketsUsed } },
      { new: true }
    );
    const data = {
      joinedPlayers: [
        {
          userId: req.userId,
          code: randomstring.generate(10),
          timeJoined: new Date().getTime(),
        },
      ],
      createdBy:req.userId,
      ...req.body.tournamentData,
    };
    const newTour = new TournamentModel(data);
    const savedTournament = await newTour.save();
    return res.send({ success: true, savedTournament, user });
  } catch (e) {
    console.log("Error in tournament/get =>", e);
    res.status(500).send({ success: false });
  }
});
router.get("/delete", async (req, res) => {
  await TournamentModel.deleteMany({});
  res.send("Done");
});
module.exports = router;
