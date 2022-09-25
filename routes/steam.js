const path = require("path");
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("dotenv").config()
const express = require("express");
const { UserModel } = require("../config/database");
const router = express.Router();

router.get("/auth/steam", passport.authenticate("steam", { session: false }));
router.get("/all",async (req,res)=>{
    const data = await UserModel.find({})
    res.send(data)
})
router.get("/all/delete",async (req,res)=>{
  const data = await UserModel.deleteMany({})
  res.send(data)
})
router.get(
  "/auth/steam/return",
  passport.authenticate("steam", { session: false }),
  (req, res) => {
    const url =req.protocol + '://' + req.get('host')
    console.log({url})
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        
   
  <script>
    try{window.opener.postMessage({
    ok: true,
    user:${JSON.stringify(req.user)}

  },"${process.env.CLIENT_URL}");


}
  catch(e){
    console.log(e)
  }

  </script>
        <script>
        </script>
    </body>
    </html>
    `);
  },
);
router.get("/user/check/:address",async (req,res)=>{
  const foundUser = await UserModel.findOne({address:req.params.address})
  if(!foundUser) return {success:false}
  if(foundUser.isSteamConnected){
    return res.send({success:true,isSteamConnected:true,foundUser})
  }
    return res.send({success:false,isSteamConnected:true,foundUser})

})
router.post("/user/:address",async (req,res)=>{
  const updatedUser = await UserModel.findOneAndUpdate({address:req.params.address},{...req.body,isSteamConnected:true,isMetamaskConnected:true},{new:true,upsert:true})
  return res.send({success:true,updatedUser})
})
module.exports = router;