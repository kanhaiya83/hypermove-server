const express = require("express");
const { PoolProjectModel } = require("../config/database");
const verifyJWT = require("../middlewares/verifyJWT");
// const jwt = require("jsonwebtoken");
require("dotenv").config()
const router = express.Router();
router.get("/",async (req,res)=>{
    // const pool = new PoolProjectModel({totalRaise:100000})
    // await pool.save()
    // await PoolProjectModel.deleteMany({})
    try{
        const pools= await PoolProjectModel.find({})
        return res.send({success:true,data:pools[0]})
    }
    catch(e){}
})
router.get("/reset",async (req,res)=>{
    const pool = new PoolProjectModel({totalRaise:100000})
    await pool.save()
    res.send("success")
    }
)

router.post("/",verifyJWT  ,async(req,res)=>{
    console.log(req.body)
    const amount = req.body.amount
    if(!amount){
        return 
    }
        const updatedProject = await PoolProjectModel.findOneAndUpdate({},{
            $inc:{raised:amount}
        },{new:true})
        return res.send({
            success:true,updatedProject
        })
})

module.exports = router