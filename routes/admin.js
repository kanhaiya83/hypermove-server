const path = require("path");
const express = require("express");
const jwt = require("jsonwebtoken");
const verifyJWT = require("../middlewares/verifyJWT");
const { PartnersModel } = require("../config/database");
const app = express();
const multer  = require('multer')
const {uploadImage} = require("./../utils/uploadImage")
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
})

var upload = multer({ storage: storage });
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
  router.get("/partners",async (req,res)=>{
    const partners = await PartnersModel.find({});
    return res.send({success:true,partnersList:partners})
  })
  router.delete("/partner/:id",async (req,res)=>{
      await PartnersModel.deleteOne({_id:req.params.id})
      return res.send({success:true})
  })
  router.post("/partners",upload.single("partner-image"),async(req,res)=>{
    const partnerImage =req.file.filename
  const {url} = await uploadImage(path.join(__dirname,"../uploads/",partnerImage))
  console.log({image:url,...req.body})
  const newPartner = new PartnersModel({image:url,...req.body})
  const savedPartner = await newPartner.save()
  return res.send({success:true,savedPartner})
  })
module.exports = router;
