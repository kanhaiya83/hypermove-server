const express = require("express");
// const jwt = require("jsonwebtoken");
require("dotenv").config()
const router = express.Router();
const Web3 = require("web3");
const verifyJWT=require("./../middlewares/verifyJWT")

const isValidEthAddress = (address) => Web3.utils.isAddress(address);

const { ScoreModel } = require("../config/database");
// const verifyJWT = require("../middlewares/verifyJWT");
const checkPassword=(req,res,next)=>{
  if(req.header("auth-password") &&req.header("auth-password") ===process.env.PASSWORD ){
    return next()
  }
  res.status(401).send({success:false})
}

router.post("/",async (req, res) => {

  const {name,walletAddress,score}=req.body;
if(!isValidEthAddress(walletAddress)){
  return res.send({success:false,message:"Invalid wallet address!",error:"Invalid wallet address!"})
}
    const newScore = new ScoreModel({
      name:req.body.name,
      walletAddress: req.body.walletAddress,
      score:req.body.score,
      createdAt:new Date().getTime()
    });
    try {
      const savedScore = await newScore.save();
  
      res.send({success:true,score:savedScore});
    } catch (e) {
      return res.status(500).send({ success:false,message:"Some error occurred!!",error: e });
    }
  });


router.get("/", async (req, res) => {
 
  try {
    const scores= await ScoreModel.find({isBanned:false});

    res.send({success:true,scores});
  } catch (e) {
    return res.status(500).send({ success:false,message:"Some error occurred!!",error: e });
  }
});
router.get("/all", async (req, res) => {
  try {
    const scores= await ScoreModel.find({});

    res.send({success:true,scores});
  } catch (e) {
    return res.status(500).send({ success:false,message:"Some error occurred!!",error: e });
  }
});
router.delete("/:id",verifyJWT,async (req, res) => {
 const id=req.params.id
    try {
      const scores= await ScoreModel.deleteOne({id:id});
  
      res.send({success:true});
    } catch (e) {
      return res.status(500).send({ success:false,message:"Some error occurred!!",error: e });
    }
  })
  router.patch("/:id",verifyJWT,async (req, res) => {
   const id=req.params.id
      try {
         await ScoreModel.updateOne({_id:id},{...req.body});
    const scores= await ScoreModel.find({}) 
        res.send({success:true,scores});
      } catch (e) {
        return res.status(500).send({ success:false,message:"Some error occurred!!",error: e });
      }
    })
  
module.exports = router;
