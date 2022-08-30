const path = require("path");
const express = require("express");
const jwt = require("jsonwebtoken");
const verifyJWT = require("../middlewares/verifyJWT");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router();
router.post("/login", async (req, res) => {
    const {password}=req.body
    console.log(password);
    if(password && password === process.env.ADMIN_PASSWORD){
      const authToken = await jwt.sign({}, process.env.JWT_SECRET);
      return res.send({success:true,authToken})
      
    }
    return res.send({success:false})
  })
  router.get("/",  (req, res) => {
    try {
      res.sendFile(path.resolve(__dirname+"/../public/index.html"))
    } catch (e) {
      return res.status(500).send({ success:false,message:"Some error occurred!!",error: e });
    }
  });
  router.get("/verify",verifyJWT,  (req, res) => {
    try {
      return res.send({success:true})
    } catch (e) {
      return res.status(500).send({ success:false,message:"Some error occurred!!",error: e });
    }
  });
module.exports = router;
