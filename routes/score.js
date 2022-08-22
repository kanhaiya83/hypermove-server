const express = require("express");
// const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());

const router = express.Router();




const { ScoreModel } = require("../config/database");
// const verifyJWT = require("../middlewares/verifyJWT");



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
router.delete("/",async (req, res) => {
 
    try {
      const scores= await ScoreModel.deleteMany();
  
      res.send({success:true});
    } catch (e) {
      return res.status(500).send({ success:false,message:"Some error occurred!!",error: e });
    }
  })
module.exports = router;
