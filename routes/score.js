const express = require("express");
// const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
require("dotenv").config()
const router = express.Router();




const { ScoreModel } = require("../config/database");
// const verifyJWT = require("../middlewares/verifyJWT");
const checkPassword=(req,res,next)=>{
  if(req.header("auth-password") &&req.header("auth-password") ===process.env.PASSWORD ){
    return next()
  }
  res.status(401).send({success:false})
}


router.post("/", async (req, res) => {
    const newScore = new ScoreModel({
      name:req.body.name,
      walletAddress: req.body.walletAddress,
      score:req.body.score
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
    const scores= await ScoreModel.find();

    res.send({success:true,scores});
  } catch (e) {
    return res.status(500).send({ success:false,message:"Some error occurred!!",error: e });
  }
});
router.delete("/",checkPassword,async (req, res) => {
 
    try {
      const scores= await ScoreModel.deleteMany();
  
      return res.send({success:true});
    } catch (e) {
      return res.status(500).send({ success:false,message:"Some error occurred!!",error: e });
    }
  })
router.delete("/:id",async (req, res) => {
 const id=req.params.id
    try {
      const scores= await ScoreModel.deleteOne({id:id});
  
      res.send({success:true});
    } catch (e) {
      return res.status(500).send({ success:false,message:"Some error occurred!!",error: e });
    }
  })
module.exports = router;
