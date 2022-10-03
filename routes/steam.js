const path = require("path");
const randomstring = require("randomstring");
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const express = require("express");
const { UserModel } = require("../config/database");
const verifyJWT = require("../middlewares/verifyJWT");
const router = express.Router();

router.get("/auth/steam", passport.authenticate("steam", { session: false }));
router.get(
  "/auth/steam/return",
  passport.authenticate("steam", { session: false }),
  (req, res) => {
    const url = req.protocol + "://" + req.get("host");
    console.log({ url });
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
    try{
      
    window.opener.postMessage({
    ok: true,
    user:${JSON.stringify(req.user)}

  },"${process.env.CLIENT_URL}");
window.close()
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
  }
);
router.get("/user/check",verifyJWT, async (req, res) => {
  const foundUser = await UserModel.findById(req.userId);
  if (!foundUser) return res.send({ success: false });
  
  return res.send({ success: true,user:foundUser });
});
router.post("/user", verifyJWT, async (req, res) => {
  const { enteredReferralCode } = req.body;
  console.log({enteredReferralCode});
  const referralCode = randomstring.generate(10);
  let referrerData={referralCode};
  if (enteredReferralCode) {
    const referrerUser = await UserModel.findOne(
      { referralCode: enteredReferralCode }
    );
    if (!referrerUser) return;
      const referredUsers = JSON.parse(JSON.stringify(referrerUser.referredUsers))
      console.log({referredUsers},referredUsers.includes(req.userId))
     if(referredUsers.includes(req.userId)) return;
     await UserModel.updateOne({_id:referrerUser._id},
      { $push: { referredUsers: req.userId } ,$inc:
    {score:1}})
    referrerData.referredBy= referrerUser._id
  } 
  const updatedUser = await UserModel.findByIdAndUpdate(
    req.userId,
    { ...req.body,...referrerData, isSteamConnected: true, isMetamaskConnected: true },
    { new: true, upsert: true }
  );
  return res.send({ success: true, updatedUser });
});
module.exports = router;
